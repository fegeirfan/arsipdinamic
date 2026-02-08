import { PlusCircle, File, ListFilter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { EditableTable } from './editable-table';
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
import { RecordRowActions } from './record-row-actions';

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
    .select('role, team_id')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'staff';

  const { data: table } = await supabase
    .from('archive_tables')
    .select('*, team:teams(pic_id)')
    .eq('id', params.tableId)
    .single();

  const { data: myPermission } = await supabase
    .from('table_permissions')
    .select('can_view, can_insert, can_edit, can_delete')
    .eq('table_id', params.tableId)
    .eq('user_id', user.id)
    .single();

  const isPic =
    table?.team_pic_id === user.id ||
    table?.created_by === user.id ||
    (table?.team as { pic_id?: string } | null)?.pic_id === user.id;
  const canInsert =
    role === 'admin' || isPic || myPermission?.can_insert === true;
  const canEdit =
    role === 'admin' || isPic || myPermission?.can_edit === true;
  const canDelete =
    role === 'admin' || isPic || myPermission?.can_delete === true;

  const { data: columns } = await supabase
    .from('archive_columns')
    .select('*')
    .eq('table_id', params.tableId)
    .order('name');

  if (!columns) {
    console.log('No columns found for table:', params.tableId);
  }

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

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pb-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="ml-auto flex items-center gap-2 w-full md:w-auto">
              {/* Filter and Export buttons hidden for now to maintain clean UI */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <EditableTable
            tableId={params.tableId}
            columns={columns || []}
            initialRecords={records || []}
            canInsert={canInsert}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
