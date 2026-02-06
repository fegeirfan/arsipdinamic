import { createClient } from '@/utils/supabase/server';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Table as TableIcon,
    Eye,
    Lock,
    Globe,
    PlusCircle,
    MoreVertical,
    Settings2,
    Pencil,
    Trash2,
    Database
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteTableButton } from './delete-table-button';

export default async function MyArchivesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user profile and check if PIC
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, team_id')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    // Check if user is PIC of any team
    const { data: picTeams } = await supabase
        .from('teams')
        .select('id, name')
        .eq('pic_id', user.id);

    const isPic = (picTeams?.length ?? 0) > 0;

    // RLS ensures only accessible tables are returned (tim saya + tabel dengan izin/request disetujui).
    const { data: tables, error } = await supabase
        .from('archive_tables')
        .select(`
            *,
            team:teams(id, name, pic_id)
        `)
        .order('name');

    if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching tables:', error);
    }

    // Determine if user can manage each table
    const canManageTable = (table: any) => {
        if (isAdmin) return true;
        if (table.team_pic_id === user.id) return true;
        if (table.created_by === user.id) return true;
        if (table.team?.pic_id === user.id) return true;
        return false;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Arsip Saya</h1>
                {(isPic || isAdmin) && (
                    <Button asChild className="bg-sidebar-accent hover:bg-sidebar-accent/90">
                        <Link href="/dashboard/my-archives/create">
                            <PlusCircle className="mr-2 h-4 w-4" /> Buat Tabel
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tables?.map((table) => {
                    const isTableManager = canManageTable(table);
                    const isCurrentUserPic =
                        table.team_pic_id === user.id ||
                        table.created_by === user.id ||
                        table.team?.pic_id === user.id;

                    return (
                        <Card key={table.id} className="group hover:border-sidebar-accent/50 transition-colors">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div className="grid gap-1 flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <TableIcon className="h-4 w-4 text-sidebar-accent" />
                                        {table.name}
                                    </CardTitle>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                        <Badge variant="outline" className="font-normal text-[10px] bg-sidebar-accent/5">
                                            Tim: {table.team?.name || 'TANPA TIM'}
                                        </Badge>
                                        {isCurrentUserPic && (
                                            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                                                Anda PIC
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-1">
                                        {table.description || 'Tidak ada deskripsi.'}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={table.visibility === 'public' ? 'secondary' : 'destructive'} className="shrink-0">
                                        {table.visibility === 'public' ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                                        {table.visibility.toUpperCase()}
                                    </Badge>
                                    {isTableManager && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi Tabel</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/tables/${table.id}`} className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" /> Lihat Data
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/tables/${table.id}/builder`} className="cursor-pointer">
                                                        <Settings2 className="mr-2 h-4 w-4" /> Atur Kolom
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/my-archives/${table.id}/edit`} className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Tabel
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DeleteTableButton tableId={table.id} tableName={table.name} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Dibuat: {new Date(table.created_at).toLocaleDateString()}
                                    </span>
                                    <Button asChild size="sm" variant="ghost" className="gap-2 group-hover:bg-sidebar-accent/10">
                                        <Link href={`/dashboard/tables/${table.id}`}>
                                            <Eye className="h-4 w-4" /> Buka
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {(!tables || tables.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-muted/20 rounded-lg border border-dashed border-sidebar-accent/20">
                        <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">Belum Ada Arsip</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            {isPic || isAdmin
                                ? 'Buat tabel arsip pertama untuk mulai mengelola data.'
                                : 'Anda belum memiliki akses ke tabel apapun.'}
                        </p>
                        {(isPic || isAdmin) && (
                            <Button asChild className="mt-4 bg-sidebar-accent hover:bg-sidebar-accent/90">
                                <Link href="/dashboard/my-archives/create">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Buat Tabel
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
