import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createRecord } from '../actions';
import { DriveInput } from './drive-input';

export default async function CreateRecordPage(props: {
    params: Promise<{ tableId: string }>;
}) {
    const params = await props.params;
    const tableId = params.tableId;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: table } = await supabase.from('archive_tables').select('*').eq('id', tableId).single();
    // Default sorting fallback if order_index is missing
    const { data: columns } = await supabase.from('archive_columns').select('*').eq('table_id', tableId).order('created_at', { ascending: true });

    if (!table) return <div>Table not found.</div>;

    const createRecordWithId = createRecord.bind(null, tableId);

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
                    <form className="space-y-6" action={createRecordWithId}>
                        <div className="grid gap-4">
                            {columns?.map((col) => {
                                let options = [];
                                try {
                                    options = typeof col.options === 'string' ? JSON.parse(col.options) : col.options || [];
                                } catch (e) { options = [] }

                                return (
                                    <div key={col.id} className="grid gap-2">
                                        <Label htmlFor={col.id} className="font-semibold">{col.name} {col.is_required && <span className="text-destructive">*</span>}</Label>

                                        {col.type === 'drive' ? (
                                            <DriveInput
                                                name={col.name}
                                                scriptUrl={options[0]}
                                                required={col.is_required}
                                            />
                                        ) : (
                                            <Input
                                                id={col.id}
                                                name={col.name}
                                                type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                                                required={col.is_required}
                                                className="border-sidebar-accent/10 focus:border-sidebar-accent"
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="outline" asChild className="border-sidebar-accent/20">
                                <Link href={`/dashboard/tables/${tableId}`}>Batal</Link>
                            </Button>
                            <Button type="submit" className="bg-sidebar-accent hover:bg-sidebar-accent/90">Simpan Arsip</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
