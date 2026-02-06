import Link from 'next/link';
import {
  File,
  PlusCircle,
  Lock,
  Globe,
  MoreVertical,
  Users,
  Eye,
  Settings2,
  Trash2,
  Database,
  Search,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TablesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard/my-team');
  }

  // Fetch all tables with team and PIC details
  const { data: tables, error } = await supabase
    .from('archive_tables')
    .select(`
      *,
      team:teams(id, name),
      pic:profiles!archive_tables_team_pic_id_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tables:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manajemen Tabel Arsip</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari tabel..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <Button asChild className="bg-sidebar-accent hover:bg-sidebar-accent/90">
            <Link href="/dashboard/tables/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Buat Tabel
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {tables?.map((table) => {
          return (
            <Card key={table.id} className="border-sidebar-accent/10 hover:border-sidebar-accent/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-sidebar-accent">{table.name}</CardTitle>
                    <Badge variant="outline" className="font-normal text-[10px] bg-sidebar-accent/5">
                      Tim: {table.team?.name || 'TANPA TIM'}
                    </Badge>
                  </div>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Tabel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2 text-xs mt-2">{table.description || 'Tidak ada deskripsi.'}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                    <File className="h-3 w-3" />
                    Archive Active
                  </Badge>
                  {table.visibility === 'public' ? (
                    <Badge variant="outline" className="text-[10px] h-5 gap-1 border-emerald-500/20 text-emerald-600 bg-emerald-500/5">
                      <Globe className="h-3 w-3" /> Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] h-5 gap-1 border-amber-500/20 text-amber-600 bg-amber-500/5">
                      <Lock className="h-3 w-3" /> Team-only
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/30 pt-3 pb-3 border-t border-sidebar-accent/5">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    {table.pic ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border border-sidebar-accent/20">
                            <AvatarImage src={table.pic.avatar_url} />
                            <AvatarFallback className="text-[10px]">{table.pic.full_name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">PIC: {table.pic.full_name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="text-destructive flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-[10px] font-bold">MISSING PIC</span>
                      </div>
                    )}
                  </TooltipProvider>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {format(new Date(table.created_at), 'dd MMM yyyy')}
                </span>
              </CardFooter>
            </Card>
          );
        })}
        {(!tables || tables.length === 0) && (
          <div className="col-span-full py-12 text-center bg-muted/20 rounded-lg border border-dashed border-sidebar-accent/20">
            <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Belum Ada Tabel</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Buat tabel arsip pertama untuk mulai mengelola data organisasi Anda.
            </p>
          </div>
        )}
      </div>

      <div className="bg-sidebar-accent/5 border border-sidebar-accent/10 rounded-lg p-4 mt-8">
        <p className="text-sm text-sidebar-accent font-bold">📋 Governance Note:</p>
        <p className="text-sm text-muted-foreground">
          Pastikan setiap tabel memiliki **Team Owner** dan **PIC** yang valid untuk menjamin akuntabilitas data.
        </p>
      </div>
    </div>
  );
}
