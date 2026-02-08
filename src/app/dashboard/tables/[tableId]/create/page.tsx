import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateRecordForm } from './create-record-form';

export default async function CreateRecordPage(props: {
    params: Promise<{ tableId: string }>;
}) {
    const params = await props.params;
    const tableId = params.tableId;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: table } = await supabase.from('archive_tables').select('*').eq('id', tableId).single();
    const { data: columns } = await supabase.from('archive_columns').select('*').eq('table_id', tableId).order('created_at', { ascending: true });

    if (!table) return <div>Table not found.</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/tables/${tableId}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Tambah Arsip: {table.name}</h1>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Data Arsip</CardTitle>
                    <CardDescription>Masukkan informasi detail untuk arsip baru pada tabel <strong>{table.name}</strong>.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateRecordForm
                        tableId={tableId}
                        tableName={table.name}
                        columns={columns || []}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
