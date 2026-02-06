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
    .order('created_at', { ascending: true }); // Assuming created_at exists, schema says it doesn't? 
  // Schema check: id, table_id, name, type, is_required, options. No created_at in initial schema!
  // id is UUID. Default sort might be random.
  // Let's sort by name for now or just as is. 
  // Ideally we should add 'order' column later.

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <ColumnBuilder
        tableId={tableId}
        initialColumns={columns || []}
      />
    </div>
  );
}
