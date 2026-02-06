'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Save, Loader2, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { saveTableStructure, ColumnDef } from './actions';

interface ColumnBuilderProps {
    tableId: string;
    initialColumns: any[]; // DB columns
}

export function ColumnBuilder({ tableId, initialColumns }: ColumnBuilderProps) {
    const router = useRouter();
    const [columns, setColumns] = useState<ColumnDef[]>(
        initialColumns.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            options: typeof c.options === 'string' ? JSON.parse(c.options) : c.options || [],
            is_required: c.is_required,
        }))
    );
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const addColumn = () => {
        const newCol: ColumnDef = {
            id: `temp-${Date.now()}`,
            name: '',
            type: 'text',
            options: [],
            is_required: false,
        };
        setColumns([...columns, newCol]);
    };

    const removeColumn = (id: string) => {
        // If it's a real column (not temp), add to deletedIds
        if (id && !id.startsWith('temp-')) {
            setDeletedIds([...deletedIds, id]);
        }
        setColumns(columns.filter((c) => c.id !== id));
    };

    const updateColumn = (id: string, field: keyof ColumnDef, value: any) => {
        setColumns(
            columns.map((c) => {
                if (c.id === id) {
                    // If changing type to something that doesn't use options, clear options?
                    // For now keep it simple.
                    return { ...c, [field]: value };
                }
                return c;
            })
        );
    };

    const updateOption = (id: string, value: string) => {
        // For select: comma separated
        // For drive: just the URL (stored as single string in array)
        const col = columns.find(c => c.id === id);
        if (!col) return;

        let newOptions: string[] = [];
        if (col.type === 'select') {
            newOptions = value.split(',').map(s => s.trim()).filter(s => s !== '');
        } else if (col.type === 'drive') {
            newOptions = [value.trim()];
        }

        updateColumn(id, 'options', newOptions);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Validate
            const emptyNames = columns.some(c => !c.name.trim());
            if (emptyNames) {
                toast.error('Nama kolom tidak boleh kosong');
                setIsSaving(false);
                return;
            }

            await saveTableStructure(tableId, columns, deletedIds);
            toast.success('Struktur tabel berhasil disimpan!');
            router.refresh();
            setDeletedIds([]); // Clear deleted list after successful save
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Table Builder</CardTitle>
                <CardDescription>
                    Atur struktur tabel Anda. Tambahkan kolom baru, tentukan tipe data, dan konfigurasi lainnya.
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Column Name</TableHead>
                            <TableHead className="w-[150px]">Type</TableHead>
                            <TableHead className="min-w-[200px]">Configuration (Options/URL)</TableHead>
                            <TableHead className="w-[100px] text-center">Required</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {columns.map((col, index) => (
                            <TableRow key={col.id || index}>
                                <TableCell>
                                    <Input
                                        value={col.name}
                                        onChange={(e) => updateColumn(col.id!, 'name', e.target.value)}
                                        placeholder="Nama kolom..."
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={col.type}
                                        onValueChange={(val) => updateColumn(col.id!, 'type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Checklist/Text</SelectItem>
                                            <SelectItem value="number">Numeric</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="select">Dropdown (Select)</SelectItem>
                                            {/* <SelectItem value="file">File Upload</SelectItem> */}
                                            <SelectItem value="drive" className="text-blue-600 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <HardDrive className="h-4 w-4" /> Google Drive
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {col.type === 'select' && (
                                        <Textarea
                                            defaultValue={col.options?.join(', ')}
                                            onChange={(e) => updateOption(col.id!, e.target.value)}
                                            placeholder="Pilihan 1, Pilihan 2, Pilihan 3 (pisahkan koma)"
                                            className="h-10 min-h-[40px] resize-none"
                                        />
                                    )}
                                    {col.type === 'drive' && (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                defaultValue={col.options?.[0] || ''}
                                                onChange={(e) => updateOption(col.id!, e.target.value)}
                                                placeholder="Paste Google Apps Script URL here..."
                                                className="font-mono text-xs text-blue-600 flex-1"
                                            />
                                            <a
                                                href="/docs/google-drive-integration"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-2 rounded-md hover:bg-blue-100 flex items-center gap-1 transition-colors whitespace-nowrap"
                                                title="Panduan Integrasi GAS"
                                            >
                                                Bantuan?
                                            </a>
                                        </div>
                                    )}
                                    {['text', 'number', 'date', 'file'].includes(col.type) && (
                                        <div className="text-xs text-muted-foreground italic px-2">
                                            Tidak ada konfigurasi khusus
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={col.is_required}
                                        onCheckedChange={(checked) => updateColumn(col.id!, 'is_required', checked)}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => removeColumn(col.id!)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {columns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Belum ada kolom. Klik "Add Column" untuk memulai.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button variant="outline" className="mt-4 w-full border-dashed" onClick={addColumn}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Column
                </Button>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20 flex gap-4">
                <div className="text-xs text-muted-foreground flex-1">
                    * Tombol save akan menyimpan semua perubahan struktur tabel secara permanen.
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
