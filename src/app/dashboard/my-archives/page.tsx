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
import { MyArchivesTable } from './my-archives-table';

export default async function MyArchivesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user profile
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

    // RLS ensures only accessible tables are returned
    const { data: tables, error } = await supabase
        .from('archive_tables')
        .select(`
            *,
            team:teams(id, name, pic_id)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching tables:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Arsip Saya</h1>
                    <p className="text-sm text-muted-foreground">Kelola dan lihat tabel arsip yang Anda miliki atau yang dibagikan kepada Anda.</p>
                </div>
                {(isPic || isAdmin) && (
                    <Button asChild className="bg-primary hover:bg-primary/90 font-bold shadow-md h-10 px-6">
                        <Link href="/dashboard/my-archives/create">
                            <PlusCircle className="mr-2 h-4 w-4" /> Buat Tabel
                        </Link>
                    </Button>
                )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <MyArchivesTable
                    initialTables={tables || []}
                    userId={user.id}
                    isAdmin={isAdmin}
                />

                {(!tables || tables.length === 0) && (
                    <div className="py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-input/40 mt-6">
                        <Database className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Belum Ada Arsip</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            {isPic || isAdmin
                                ? 'Buat tabel arsip pertama untuk mulai mengelola data Anda secara terstruktur.'
                                : 'Anda belum memiliki akses ke tabel apapun saat ini.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
