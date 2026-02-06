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
import { Table as TableIcon, Eye, Lock, Globe } from 'lucide-react';

export default async function MyArchivesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // For now, fetching all tables since we haven't implemented table-level permissions in data yet.
    // In a final implementation, this would filter based on public visibility OR being a PIC OR having explicit permission.
    const { data: tables, error } = await supabase
        .from('archive_tables')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching tables:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Arsip Saya</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tables?.map((table) => (
                    <Card key={table.id} className="group hover:border-sidebar-accent/50 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="grid gap-1">
                                <CardTitle className="flex items-center gap-2">
                                    <TableIcon className="h-4 w-4 text-sidebar-accent" />
                                    {table.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {table.description || 'Tidak ada deskripsi.'}
                                </CardDescription>
                            </div>
                            <Badge variant={table.visibility === 'public' ? 'secondary' : 'destructive'} className="shrink-0">
                                {table.visibility === 'public' ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                                {table.visibility.toUpperCase()}
                            </Badge>
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
                ))}
                {(!tables || tables.length === 0) && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Anda belum memiliki akses ke tabel apapun.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
