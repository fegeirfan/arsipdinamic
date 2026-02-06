import Link from 'next/link';
import {
    File,
    Table,
    Users,
    Database,
    Activity,
    Layers,
    ChevronRight,
    AlertTriangle,
    ShieldAlert,
    Clock,
    PlusCircle,
    Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table as ShadcnTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { createClient } from '@/utils/supabase/server';
import { format } from 'date-fns';

export async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch Stats
    const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: tableCount } = await supabase.from('archive_tables').select('*', { count: 'exact', head: true });
    const { count: recordCount } = await supabase.from('archive_records').select('*', { count: 'exact', head: true });

    // Fetch Alerts
    const { data: orphanedTeams } = await supabase.from('teams').select('id, name').is('pic_id', null);
    const { data: orphanedTables } = await supabase.from('archive_tables').select('id, name').is('team_id', null);
    const { count: pendingRequests } = await supabase.from('access_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: userWithoutTeam } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).is('team_id', null);

    // Fetch Recent Tables
    const { data: recentTables } = await supabase
        .from('archive_tables')
        .select(`
            *,
            team:teams(name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold font-headline tracking-tight md:text-3xl text-sidebar-accent">Dashboard Admin</h1>
                <p className="text-muted-foreground">Monitor kondisi & risiko sistem dalam satu layar.</p>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-sidebar-accent/20 hover:border-sidebar-accent/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Total Team</CardTitle>
                        <Layers className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{teamCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Struktur Organisasi</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-sidebar-accent/20 hover:border-sidebar-accent/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Total User</CardTitle>
                        <Users className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{userCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pengguna Terdaftar</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-sidebar-accent/20 hover:border-sidebar-accent/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Total Tabel</CardTitle>
                        <Database className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tableCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">Aktif</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-sidebar-accent/20 hover:border-sidebar-accent/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Total Arsip</CardTitle>
                        <Activity className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{recordCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Data Tersimpan</p>
                    </CardContent>
                </Card>
            </div>

            {/* System Alerts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-amber-500/5 border-amber-500/20">
                    <CardHeader className="pb-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mb-2" />
                        <CardTitle className="text-sm font-bold">Team tanpa PIC</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orphanedTeams?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Risiko operasional tinggi</p>
                    </CardContent>
                </Card>

                <Card className="bg-destructive/5 border-destructive/20">
                    <CardHeader className="pb-2">
                        <ShieldAlert className="h-5 w-5 text-destructive mb-2" />
                        <CardTitle className="text-sm font-bold">Tabel tanpa Tim</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orphanedTables?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Data tidak terklasifikasi</p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardHeader className="pb-2">
                        <Clock className="h-5 w-5 text-blue-500 mb-2" />
                        <CardTitle className="text-sm font-bold">Request Akses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingRequests || 0}</div>
                        <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar-accent/5 border-sidebar-accent/20">
                    <CardHeader className="pb-2">
                        <Users className="h-5 w-5 text-sidebar-accent mb-2" />
                        <CardTitle className="text-sm font-bold">User Tanpa Tim</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userWithoutTeam || 0}</div>
                        <p className="text-xs text-muted-foreground">Belum ada penugasan</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Tables */}
                <Card className="lg:col-span-2 border-sidebar-accent/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div className="grid gap-1">
                            <CardTitle className="text-xl font-bold">Pengawasan Tabel</CardTitle>
                            <CardDescription>
                                Monitoring metadata tabel lintas organisasi.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" variant="outline" className="h-8 gap-2 border-sidebar-accent/20">
                            <Link href="/dashboard/tables">
                                Semua Tabel
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-sidebar-accent/10 overflow-hidden">
                            <ShadcnTable>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">Nama Tabel</TableHead>
                                        <TableHead className="font-semibold">Team Owner</TableHead>
                                        <TableHead className="text-right font-semibold">Dibuat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTables?.map((table) => (
                                        <TableRow key={table.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="font-semibold text-sidebar-accent">{table.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal text-[10px]">
                                                    {table.team?.name || 'BELUM ADA TIM'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {format(new Date(table.created_at), 'dd MMM yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!recentTables || recentTables.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                Tidak ada tabel terbaru.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </ShadcnTable>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-sidebar-accent/10 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Action</CardTitle>
                        <CardDescription>Pintasan manajemen cepat.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button asChild variant="outline" className="justify-start gap-3 h-11 border-sidebar-accent/20 hover:bg-sidebar-accent/5">
                            <Link href="/dashboard/teams">
                                <PlusCircle className="h-4 w-4 text-sidebar-accent" />
                                Buat Team Baru
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start gap-3 h-11 border-sidebar-accent/20 hover:bg-sidebar-accent/5">
                            <Link href="/dashboard/teams">
                                <Crown className="h-4 w-4 text-sidebar-accent" />
                                Assign PIC
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start gap-3 h-11 border-sidebar-accent/20 hover:bg-sidebar-accent/5">
                            <Link href="/dashboard/access">
                                <Clock className="h-4 w-4 text-sidebar-accent" />
                                Lihat Request Akses
                                {pendingRequests ? (
                                    <Badge className="ml-auto bg-sidebar-accent" size="sm">{pendingRequests}</Badge>
                                ) : null}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
