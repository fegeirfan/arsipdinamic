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
import { Activity, Shield, Users, Database, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default async function AuditLogPage() {
    const supabase = await createClient()

    // Fetch all access requests
    const { data: requests } = await supabase
        .from('access_requests')
        .select(`
      *,
      user:profiles!access_requests_user_id_fkey(full_name, email),
      table:archive_tables(name, team:teams(name))
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    // Fetch recent record additions
    const { data: records } = await supabase
        .from('archive_records')
        .select(`
      created_at,
      user:profiles!archive_records_created_by_fkey(full_name, email),
      table:archive_tables(name, team:teams(name))
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    // Combine
    const logs = [
        ...(requests?.map(r => ({ ...r, category: 'ACCESS', date: r.created_at })) || []),
        ...(records?.map(r => ({ ...r, category: 'DATA', date: r.created_at })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-sidebar-accent" />
                <h1 className="text-lg font-semibold md:text-2xl">Audit Log</h1>
            </div>

            <Card className="border-sidebar-accent/10 shadow-sm">
                <CardHeader>
                    <CardTitle>Jejak Digital Sistem</CardTitle>
                    <CardDescription>
                        Rekaman seluruh aktivitas penting dalam sistem untuk keperluan audit dan kepatuhan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Aktor</TableHead>
                                <TableHead>Aktivitas</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log, i) => (
                                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(log.date), 'dd MMM yyyy, HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`font-normal text-[10px] ${log.category === 'ACCESS' ? 'border-blue-500/30 text-blue-600 bg-blue-500/5' : 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5'}`}>
                                            {log.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {log.user?.full_name || log.user?.email || 'System'}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {log.category === 'ACCESS' ? (
                                            <span>Minta akses <strong>{log.requested_level}</strong> ke {log.table?.name}</span>
                                        ) : (
                                            <span>Input data baru pada tabel <strong>{log.table?.name}</strong></span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {log.status ? (
                                            <Badge variant={log.status === 'approved' ? 'default' : log.status === 'pending' ? 'outline' : 'destructive'} className="text-[10px]">
                                                {log.status.toUpperCase()}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-600">
                                                COMPLETED
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        Belum ada jejak aktivitas di audit log.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" /> Keamanan Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Setiap permintaan akses dicatat dan memerlukan persetujuan Admin atau PIC tim pemilik data.</p>
                    </CardContent>
                </Card>
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-500" /> Transparansi Tim
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">PIC dapat memantau siapa saja yang memiliki akses ke tabel tim mereka melalui dashboard tim.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
