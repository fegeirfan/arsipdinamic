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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Save, Loader2, HardDrive, CheckCircle2, ChevronRight, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { saveTableStructure, ColumnDef } from './actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    const [selectedColId, setSelectedColId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Form state for current editing column
    const currentCol = columns.find(c => c.id === selectedColId);

    const addColumn = () => {
        const newCol: ColumnDef = {
            id: `temp-${Date.now()}`,
            name: `Kolom Baru ${columns.length + 1}`,
            type: 'text',
            options: [],
            is_required: false,
        };
        setColumns([...columns, newCol]);
        setSelectedColId(newCol.id!);
    };

    const removeColumn = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (id && !id.startsWith('temp-')) {
            setDeletedIds([...deletedIds, id]);
        }
        const newCols = columns.filter((c) => c.id !== id);
        setColumns(newCols);
        // If we removed the selected column, deselect it or select the previous one
        if (selectedColId === id) {
            setSelectedColId(null);
        }
    };

    const updateCurrentColumn = (field: keyof ColumnDef, value: any) => {
        if (!selectedColId) return;
        setColumns(columns.map(c =>
            c.id === selectedColId ? { ...c, [field]: value } : c
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const emptyNames = columns.some(c => !c.name.trim());
            if (emptyNames) {
                toast.error('Nama kolom tidak boleh kosong');
                setIsSaving(false);
                return;
            }

            await saveTableStructure(tableId, columns, deletedIds);
            toast.success('Struktur tabel tersimpan!');
            router.push(`/dashboard/tables/${tableId}`); // Redirect to table data page
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Left Panel: Column List */}
            <Card className="lg:col-span-4 flex flex-col h-full border-sidebar-border/50 shadow-sm">
                <CardHeader className="py-4 border-b bg-muted/5">
                    <CardTitle className="text-base flex justify-between items-center">
                        Daftar Kolom
                        <Badge variant="secondary">{columns.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-2 space-y-2 bg-muted/5">
                    {columns.map((col, idx) => (
                        <div
                            key={col.id || idx}
                            onClick={() => setSelectedColId(col.id!)}
                            className={cn(
                                "group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                                selectedColId === col.id
                                    ? "bg-white border-primary shadow-sm"
                                    : "bg-white/50 border-transparent hover:bg-white"
                            )}
                        >
                            <div className="text-xs font-mono text-muted-foreground w-6 text-center">{idx + 1}</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{col.name || 'Tanpa Nama'}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 uppercase">{col.type}</Badge>
                                    {col.is_required && <span className="text-destructive font-bold text-[10px]">*Wajib</span>}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => removeColumn(col.id!, e)}
                            >
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </Button>
                            <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", selectedColId === col.id && "text-primary")} />
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full border-dashed border-primary/20 text-primary hover:bg-primary/5 h-12"
                        onClick={addColumn}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kolom
                    </Button>
                </CardContent>
            </Card>

            {/* Right Panel: Column Form */}
            <Card className="lg:col-span-8 flex flex-col h-full border-sidebar-border/50 shadow-sm relative overflow-hidden">
                {currentCol ? (
                    <>
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                Edit Kolom: <span className="text-primary">{currentCol.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div className="grid gap-6 max-w-xl">
                                <div className="space-y-2">
                                    <Label>Nama Kolom</Label>
                                    <Input
                                        value={currentCol.name}
                                        onChange={(e) => updateCurrentColumn('name', e.target.value)}
                                        placeholder="Contoh: Tanggal Surat, Nomor Agenda..."
                                        className="text-lg font-medium"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tipe Data</Label>
                                        <Select
                                            value={currentCol.type}
                                            onValueChange={(val) => updateCurrentColumn('type', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Teks Singkat</SelectItem>
                                                <SelectItem value="number">Angka / Nominal</SelectItem>
                                                <SelectItem value="date">Tanggal</SelectItem>
                                                <SelectItem value="select">Pilihan (Dropdown)</SelectItem>
                                                <SelectItem value="drive">
                                                    <span className="flex items-center gap-2 text-blue-600 font-semibold">
                                                        <HardDrive className="h-3 w-3" /> File (Google Drive)
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 flex items-end pb-2">
                                        <div className="flex items-center space-x-2 border p-3 rounded-md w-full bg-muted/5">
                                            <Switch
                                                id="req-mode"
                                                checked={currentCol.is_required}
                                                onCheckedChange={(c) => updateCurrentColumn('is_required', c)}
                                            />
                                            <Label htmlFor="req-mode" className="cursor-pointer">Wajib Diisi (Required)</Label>
                                        </div>
                                    </div>
                                </div>

                                {(currentCol.type === 'select' || currentCol.type === 'drive') && (
                                    <div className="space-y-2 p-4 border rounded-lg bg-blue-50/50 border-blue-100">
                                        <Label className="text-blue-700">
                                            {currentCol.type === 'select' ? 'Opsi Pilihan (Pisahkan dengan koma)' : 'Google Apps Script URL'}
                                        </Label>
                                        {currentCol.type === 'select' ? (
                                            <Textarea
                                                value={currentCol.options?.join(', ')}
                                                onChange={(e) => {
                                                    const opts = e.target.value.split(',').map(s => s.trim());
                                                    updateCurrentColumn('options', opts);
                                                }}
                                                placeholder="Contoh: Draft, Disetujui, Ditolak"
                                                className="bg-white"
                                            />
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    value={currentCol.options?.[0] || ''}
                                                    onChange={(e) => updateCurrentColumn('options', [e.target.value])}
                                                    placeholder="https://script.google.com/macros/s/..."
                                                    className="font-mono text-xs bg-white text-blue-600"
                                                />
                                                <p className="text-[10px] text-muted-foreground">
                                                    Masukkan Web App URL dari deployment Google Apps Script Anda untuk menangani upload file.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <div className="p-4 rounded-full bg-muted/20">
                            <GripVertical className="h-8 w-8 opacity-20" />
                        </div>
                        <p>Pilih kolom di sebelah kiri untuk mengedit detailnya.</p>
                        <Button variant="secondary" onClick={addColumn}>Buat Kolom Baru</Button>
                    </div>
                )}

                <div className="p-4 border-t bg-muted/5 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                        {columns.length} Kolom dikonfigurasi
                    </span>
                    <Button
                        size="lg"
                        onClick={() => setShowConfirm(true)}
                        disabled={columns.length === 0 || isSaving}
                        className="px-8 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-900/10"
                    >
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                        Selesai & Aktifkan Tabel
                    </Button>
                </div>
            </Card>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Pembuatan Tabel</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tabel akan dibuat dengan <strong>{columns.length} kolom</strong>.
                            Setelah disimpan, tabel akan aktif dan anggota tim dapat mulai mengisi data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave} className="bg-primary">
                            Ya, Aktifkan Tabel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
