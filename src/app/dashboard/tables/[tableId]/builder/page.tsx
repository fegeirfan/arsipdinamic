import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isTablePic } from '@/lib/auth-pic';
import { ColumnBuilder } from './column-builder';

export default async function TableBuilderPage(props: {
  params: Promise<{ tableId: string }>;
}) {
  const params = await props.params;
  const tableId = params.tableId;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const allowed = await isTablePic(tableId);
  if (!allowed) redirect('/dashboard/tables');

  // Fetch real columns from DB
  const { data: columns, error } = await supabase
    .from('archive_columns')
    .select('*')
    .eq('table_id', tableId)
    .order('name');

  if (error) {
    console.error('Error fetching columns:', error);
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <ColumnBuilder
        tableId={tableId}
        initialColumns={columns || []}
      />
    </div>
  );
}
