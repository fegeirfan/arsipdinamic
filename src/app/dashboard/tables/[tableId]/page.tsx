import { PlusCircle, File, Search, ListFilter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TableDataPage(props: {
  params: Promise<{ tableId: string }>;
}) {
  const params = await props.params;
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

  const role = profile?.role || 'staff';

  const { data: table } = await supabase
    .from('archive_tables')
    .select('*')
    .eq('id', params.tableId)
    .single();

  const { data: columns } = await supabase
    .from('archive_columns')
    .select('*')
    .eq('table_id', params.tableId)
    .order('order_index');

  const { data: records } = await supabase
    .from('archive_records')
    .select('*')
    .eq('table_id', params.tableId)
    .order('created_at', { ascending: false });

  if (!table) {
    return <div>Table not found.</div>;
  }

  const renderCell = (record: any, column: any) => {
    const value = record.data[column.name] || record.data[column.id]; // Handle both name and id as keys
    switch (column.type) {
      case 'date':
        return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
      case 'file':
        return value ? <Link href={value} className="text-primary underline" target="_blank">{value.split('/').pop()}</Link> : 'No file';
      case 'select':
        return value ? <Badge variant="secondary">{value}</Badge> : 'N/A';
      case 'number':
        return value ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value) : '0';
      default:
        return value || 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={role === 'admin' ? '/dashboard/tables' : '/dashboard/my-archives'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">{table.name}</h1>
          <p className="text-sm text-muted-foreground">{table.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="w-full rounded-lg bg-background pl-8"
              />
            </div>
            <div className="ml-auto flex items-center gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export PDF</span>
              </Button>
              <Button size="sm" className="h-8 gap-1" asChild>
                <Link href={`/dashboard/tables/${params.tableId}/create`}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Tambah Arsip</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns?.map((col) => (
                    <TableHead key={col.id}>{col.name}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Data Info</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records?.map((record) => (
                  <TableRow key={record.id}>
                    {columns?.map((col) => (
                      <TableCell key={`${record.id}-${col.id}`}>
                        {renderCell(record, col)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex flex-col text-[10px] text-muted-foreground">
                        <span>Oleh: {record.created_by_email || 'System'}</span>
                        <span>{format(new Date(record.created_at), 'dd/MM/yy HH:mm')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!records || records.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={(columns?.length || 0) + 2} className="h-24 text-center">
                      Tidak ada arsip ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
