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
import { Clock, PlusCircle, ShieldCheck, ShieldAlert, History } from 'lucide-react'
import { format } from 'date-fns'

export default async function UserActivityPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch record creations
    const { data: records } = await supabase
        .from('archive_records')
        .select('created_at, table:archive_tables(name)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Fetch access requests
    const { data: requests } = await supabase
        .from('access_requests')
        .select('*, table:archive_tables(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Combine and sort activities
    const activities = [
        ...(records?.map(r => ({ ...r, type: 'record_create', date: r.created_at })) || []),
        ...(requests?.map(req => ({ ...req, type: 'access_request', date: req.created_at })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-sidebar-accent" />
                <h1 className="text-lg font-semibold md:text-2xl">Aktivitas Saya</h1>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Riwayat Aktivitas & Permintaan</CardTitle>
                    <CardDescription>
                        Pantau semua kontribusi arsip dan status permohonan akses Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Aktivitas</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead className="text-right">Status / Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((act, i) => (
                                <TableRow key={i}>
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(act.date), 'dd MMM yyyy, HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {act.type === 'record_create' ? (
                                                <>
                                                    <PlusCircle className="h-3 w-3 text-emerald-500" />
                                                    <span className="text-sm">Tambah Arsip</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                                                    <span className="text-sm">Request Akses</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {act.table?.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {act.type === 'record_create' ? (
                                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-600">
                                                SUCCESS
                                            </Badge>
                                        ) : (
                                            <Badge variant={act.status === 'approved' ? 'default' : act.status === 'pending' ? 'outline' : 'destructive'} className="text-[10px]">
                                                {act.status.toUpperCase()}
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {activities.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        Belum ada riwayat aktivitas.
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
