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
import { Check, X, Clock, ShieldCheck, ShieldAlert } from 'lucide-react'
import { processAccessRequest } from './actions'

export default async function AccessRequestsPage() {
    const supabase = await createClient()

    // Fetch requests with user, table, and source team details
    const { data: requests, error } = await supabase
        .from('access_requests')
        .select(`
      *,
      user:profiles!access_requests_user_id_fkey(full_name, email, team:teams!profiles_team_id_fkey(name)),
      table:archive_tables(name, team:teams(name))
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Akses & Permintaan</h1>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Persetujuan Akses (Approval Center)</CardTitle>
                    <CardDescription>
                        Admin memantau dan mengelola izin lintas tim untuk menjaga keamanan data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Tim Asal</TableHead>
                                <TableHead>Tabel Tujuan</TableHead>
                                <TableHead>Izin Diminta</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests?.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{req.user.full_name || req.user.email}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">{req.user.team?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline" className="font-normal">{req.user.team?.name || 'N/A'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{req.table.name}</span>
                                            <span className="text-xs text-muted-foreground">Tim: {req.table.team?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize text-[10px] h-5">
                                            {req.requested_level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {req.status === 'pending' && (
                                            <Badge variant="outline" className="gap-1 animate-pulse border-amber-500/50 bg-amber-500/10 text-amber-600">
                                                <Clock className="h-3 w-3" /> ⏳ Pending
                                            </Badge>
                                        )}
                                        {req.status === 'approved' && (
                                            <Badge variant="outline" className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600">
                                                <ShieldCheck className="h-3 w-3" /> Disetujui
                                            </Badge>
                                        )}
                                        {req.status === 'rejected' && (
                                            <Badge variant="outline" className="gap-1 border-destructive/50 bg-destructive/10 text-destructive">
                                                <ShieldAlert className="h-3 w-3" /> Ditolak
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <form action={async () => { await processAccessRequest(req.id, 'approved') }}>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                                <form action={async () => { await processAccessRequest(req.id, 'rejected') }}>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Processed</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!requests || requests.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        Belum ada permintaan akses masuk.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-sidebar-accent/5 border border-sidebar-accent/10 rounded-lg p-4">
                <p className="text-sm text-sidebar-accent font-medium">💡 Admin Privilege:</p>
                <p className="text-sm text-muted-foreground">
                    Admin dapat menyetujui akses lintas tim secara langsung atau meneruskannya ke PIC tim terkait untuk keputusan internal.
                </p>
            </div>
        </div>
    )
}
