'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createRecord } from '../actions';
import { DriveInput } from './drive-input';
import { useToast } from '@/hooks/use-toast';

export function CreateRecordForm({
    tableId,
    tableName,
    columns
}: {
    tableId: string;
    tableName: string;
    columns: any[]
}) {
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const res = await createRecord(tableId, formData);
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Gagal menyimpan",
                    description: res.error
                });
            } else {
                toast({
                    title: "Berhasil",
                    description: "Arsip berhasil ditambahkan"
                });
                router.push(`/dashboard/tables/${tableId}`);
                router.refresh();
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Terjadi kesalahan sistem saat menyimpan."
            });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form className="space-y-6" action={handleSubmit}>
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
                <Button variant="outline" asChild className="border-sidebar-accent/20" disabled={isPending}>
                    <Link href={`/dashboard/tables/${tableId}`}>Batal</Link>
                </Button>
                <Button type="submit" className="bg-sidebar-accent hover:bg-sidebar-accent/90" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Arsip
                </Button>
            </div>
        </form>
    );
}
