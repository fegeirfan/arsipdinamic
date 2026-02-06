import Link from 'next/link';
import {
    PlusCircle,
    Search,
    Table,
    FileText,
    Clock,
    ShieldCheck,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';

export async function UserDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch User Profile with Team
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, team:teams!profiles_team_id_fkey(name)')
        .eq('id', user.id)
        .single();

    // Stats
    const { count: teamTables } = await supabase
        .from('archive_tables')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', profile?.team_id);

    const { count: myRecords } = await supabase
        .from('archive_records')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

    const { data: myRequests } = await supabase
        .from('access_requests')
        .select('*, table:archive_tables(name)')
        .eq('user_id', user.id)
        .limit(3);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-sidebar-accent">
                    Halo, {profile?.full_name || 'User'}!
                </h1>
                <p className="text-muted-foreground">
                    {profile?.team?.name ? `Anggota Tim: ${profile.team.name}` : 'Anda belum bergabung dengan tim manapun.'}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tabel Tim Saya</CardTitle>
                        <Table className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{teamTables || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Akses otomatis tim</p>
                    </CardContent>
                </Card>
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arsip Saya</CardTitle>
                        <FileText className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{myRecords || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Kontribusi Anda</p>
                    </CardContent>
                </Card>
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Izin Disetujui</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-sidebar-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">Akses luar tim</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Requests */}
                <Card className="border-sidebar-accent/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Status Permintaan Akses</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="h-8">
                            <Link href="/dashboard/activity">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myRequests?.map((req) => (
                                <div key={req.id} className="flex items-center justify-between border-b border-sidebar-accent/5 pb-3 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{req.table?.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">Level: {req.requested_level}</p>
                                    </div>
                                    <Badge variant={req.status === 'approved' ? 'default' : req.status === 'pending' ? 'outline' : 'destructive'} className="text-[10px]">
                                        {req.status.toUpperCase()}
                                    </Badge>
                                </div>
                            ))}
                            {(!myRequests || myRequests.length === 0) && (
                                <div className="text-center py-6">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Belum ada permintaan akses.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-sidebar-accent/20 bg-sidebar-accent/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Opsi Bekerja</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Button asChild className="w-full justify-between bg-sidebar-accent hover:bg-sidebar-accent/90">
                            <Link href="/dashboard/my-team">
                                <span className="flex items-center gap-2">
                                    <Table className="h-4 w-4" />
                                    Arsip Tim Saya
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-between border-sidebar-accent/20 hover:bg-sidebar-accent/10">
                            <Link href="/dashboard/browse">
                                <span className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    Jelajahi Tabel Lain
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
