import { createClient } from '@/utils/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Clock, Search, Globe } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RequestAccessModal } from './request-access-modal'

export default async function BrowseTablesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch user profile for team context
    const { data: profile } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single()

    // Fetch all tables with team info
    const { data: tables } = await supabase
        .from('archive_tables')
        .select(`
      *,
      team:teams(id, name)
    `)
        .order('name')

    // Fetch user's requests
    const { data: requests } = await supabase
        .from('access_requests')
        .select('table_id, status')
        .eq('user_id', user.id)

    const getTableStatus = (table: any) => {
        // 1. If table is in user's team -> Accessible
        if (table.team_id === profile?.team_id) return 'accessible'

        // 2. Check if there's an approved request -> Accessible
        const approved = requests?.find(r => r.table_id === table.id && r.status === 'approved')
        if (approved) return 'accessible'

        // 3. Check if there's a pending request -> Pending
        const pending = requests?.find(r => r.table_id === table.id && r.status === 'pending')
        if (pending) return 'pending'

        // 4. Otherwise -> Locked
        return 'locked'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold md:text-2xl">Jelajahi Tabel</h1>
                    <p className="text-sm text-muted-foreground">Temukan data di seluruh organisasi.</p>
                </div>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Eksplorasi Data Lintas Tim</CardTitle>
                    <CardDescription>
                        Tabel unit lain terkunci secara default. Kirim permintaan akses untuk membuka data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tabel</TableHead>
                                <TableHead>Pemilik</TableHead>
                                <TableHead className="text-center">Status Akses</TableHead>
                                <TableHead className="text-right">Opsi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tables?.map((table) => {
                                const status = getTableStatus(table)
                                return (
                                    <TableRow key={table.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sidebar-accent">{table.name}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">{table.team?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal capitalize">{table.team?.name || 'BELUM ADA TIM'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {status === 'accessible' && (
                                                <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-600">
                                                    <Eye className="h-3 w-3" /> Terbuka
                                                </Badge>
                                            )}
                                            {status === 'pending' && (
                                                <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/5 text-amber-600">
                                                    <Clock className="h-3 w-3" /> Menunggu
                                                </Badge>
                                            )}
                                            {status === 'locked' && (
                                                <Badge variant="outline" className="gap-1 border-muted-foreground/30 bg-muted/5 text-muted-foreground">
                                                    🔒 Terkunci
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {status === 'accessible' ? (
                                                <Button size="sm" variant="ghost" asChild className="h-8 gap-1">
                                                    <Link href={`/dashboard/tables/${table.id}`}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Lihat
                                                    </Link>
                                                </Button>
                                            ) : status === 'pending' ? (
                                                <Button size="sm" variant="ghost" disabled className="h-8 text-xs italic">
                                                    Request Pending
                                                </Button>
                                            ) : (
                                                <RequestAccessModal tableId={table.id} tableName={table.name} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {(!tables || tables.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        Tidak ada tabel yang tersedia untuk dijelajahi.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
