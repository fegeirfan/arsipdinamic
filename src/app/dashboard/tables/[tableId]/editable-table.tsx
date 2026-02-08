'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Plus, Save, X, Loader2, Check, ExternalLink, Upload, Search } from 'lucide-react'
import { createRecord, patchRecord } from './actions'
import { useToast } from '@/hooks/use-toast'
import { RecordRowActions } from './record-row-actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Column {
    id: string
    name: string
    type: string
    is_required: boolean
    options?: any
}

interface RecordData {
    id: string
    data: Record<string, any>
    created_at: string
    created_by?: string // Changed from created_by_email as it might be missing
}

// Sub-component for Drive Upload in Cells/Quick Add
function MiniDriveUpload({
    onUploadSuccess,
    scriptUrl,
    defaultValue,
    isEditMode = true
}: {
    onUploadSuccess: (url: string) => void,
    scriptUrl?: string,
    defaultValue?: string,
    isEditMode?: boolean
}) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !scriptUrl) return

        setIsUploading(true)
        try {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64 = reader.result?.toString().split(',')[1]
                const payload = { filename: file.name, mimeType: file.type, file: base64 }

                const res = await fetch(scriptUrl, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                })
                const data = await res.json()
                if (data.url) {
                    onUploadSuccess(data.url)
                }
            }
        } catch (err) {
            console.error('Upload failed', err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="*/*"
            />
            {isEditMode && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all shadow-sm font-medium"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {isUploading ? 'Menunggah...' : 'Form Upload'}
                </Button>
            )}
            {defaultValue && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 animate-in fade-in zoom-in duration-300">
                    <Check className="h-3 w-3" />
                    <span className="text-[10px] font-medium">Tersedia</span>
                </div>
            )}
        </div>
    )
}

export function EditableTable({
    tableId,
    columns,
    initialRecords,
    canInsert,
    canEdit,
    canDelete,
}: {
    tableId: string
    columns: Column[]
    initialRecords: RecordData[]
    canInsert: boolean
    canEdit: boolean
    canDelete: boolean
}) {
    const [records, setRecords] = useState<RecordData[]>(initialRecords)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingCell, setEditingCell] = useState<{ recordId: string; columnName: string } | null>(null)
    const [editValue, setEditValue] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [quickAdd, setQuickAdd] = useState<Record<string, any>>({})
    const [isAdding, setIsAdding] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Sync records when initialRecords change
    useEffect(() => {
        setRecords(initialRecords)
        setCurrentPage(1) // Reset to first page on data change
    }, [initialRecords])

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus()
        }
    }, [editingCell])

    const handleCellClick = (recordId: string, columnName: string, value: any) => {
        if (!canEdit || !isEditMode) return
        setEditingCell({ recordId, columnName })
        setEditValue(value || '')
    }

    const filteredRecords = records.filter(record => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return columns.some(col => {
            const val = record.data[col.name]
            return val?.toString().toLowerCase().includes(searchLower)
        })
    })

    // Pagination Logic
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Reset page if search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const handleSaveEdit = async () => {
        if (!editingCell || !canEdit || isSaving) return
        const { recordId, columnName } = editingCell

        const originalRecord = records.find(r => r.id === recordId)
        if (originalRecord && originalRecord.data[columnName] === editValue) {
            setEditingCell(null)
            return
        }

        setIsSaving(true)
        try {
            const result = await patchRecord(tableId, recordId, columnName, editValue)
            if (result.success) {
                setRecords(prev => prev.map(r =>
                    r.id === recordId ? { ...r, data: { ...r.data, [columnName]: editValue } } : r
                ))
                setEditingCell(null)
                toast({ title: 'Tersimpan' })
            } else {
                toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Terjadi kesalahan sistem', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleQuickAdd = async () => {
        if (!canInsert || isAdding) return

        const missingRequired = columns.filter(col => col.is_required && !quickAdd[col.name])
        if (missingRequired.length > 0) {
            toast({
                title: 'Lengkapi data',
                description: `Wajib: ${missingRequired.map(c => c.name).join(', ')}`,
                variant: 'destructive'
            })
            return
        }

        setIsAdding(true)
        try {
            const formData = new FormData()
            Object.entries(quickAdd).forEach(([key, val]) => {
                formData.append(key, val)
            })

            const result = await createRecord(tableId, formData)
            if (result.success && result.data) {
                setRecords(prev => [result.data as RecordData, ...prev])
                setQuickAdd({})
                toast({ title: 'Berhasil', description: 'Arsip ditambahkan' })
            } else {
                toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Gagal koneksi server', variant: 'destructive' })
        } finally {
            setIsAdding(false)
        }
    }

    const getColOptions = (col: Column) => {
        try {
            return typeof col.options === 'string' ? JSON.parse(col.options) : col.options || []
        } catch (e) { return [] }
    }

    const renderCellContent = (record: RecordData, col: Column) => {
        const value = record.data[col.name]
        const isEditing = editingCell?.recordId === record.id && editingCell?.columnName === col.name
        const options = getColOptions(col)

        if (isEditing) {
            if (col.type === 'drive') {
                return (
                    <MiniDriveUpload
                        scriptUrl={options[0]}
                        defaultValue={value}
                        isEditMode={isEditMode}
                        onUploadSuccess={(url) => {
                            setEditValue(url)
                            const triggerSave = async () => {
                                setIsSaving(true)
                                try {
                                    const result = await patchRecord(tableId, record.id, col.name, url)
                                    if (result.success) {
                                        setRecords(prev => prev.map(r => r.id === record.id ? { ...r, data: { ...r.data, [col.name]: url } } : r))
                                        setEditingCell(null)
                                    }
                                } finally {
                                    setIsSaving(false)
                                }
                            }
                            triggerSave()
                        }}
                    />
                )
            }
            return (
                <div className="flex items-center gap-1">
                    <Input
                        ref={inputRef}
                        className="h-8 py-0 px-2 text-sm focus-visible:ring-ring border-primary/30"
                        value={editValue || ''}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit()
                            if (e.key === 'Escape') setEditingCell(null)
                        }}
                        onBlur={handleSaveEdit}
                        disabled={isSaving}
                    />
                    {isSaving && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                </div>
            )
        }

        switch (col.type) {
            case 'date':
                return (
                    <div
                        className={cn(
                            "p-2 rounded-md transition-all text-xs min-h-[2rem] flex items-center",
                            isEditMode && canEdit ? "cursor-pointer hover:bg-accent border border-transparent hover:border-input" : ""
                        )}
                        onClick={() => handleCellClick(record.id, col.name, value)}
                    >
                        {value ? format(new Date(value), 'dd MMM yyyy') : <span className="text-muted-foreground/50">Kosong</span>}
                    </div>
                )
            case 'file':
            case 'drive':
                return value ? (
                    <div className="flex items-center gap-2 group/file p-1">
                        <Link
                            href={value}
                            className="bg-primary/5 text-primary border border-primary/20 px-2 py-1 rounded-md text-[10px] font-bold hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                            target="_blank"
                        >
                            <ExternalLink className="h-3 w-3" />
                            LIHAT FILE
                        </Link>
                        {isEditMode && canEdit && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover/file:opacity-100 transition-opacity"
                                onClick={() => handleCellClick(record.id, col.name, value)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ) : (
                    <div
                        className={cn(
                            "text-muted-foreground/60 italic p-2 rounded-md text-xs min-h-[2rem] flex items-center",
                            isEditMode && canEdit ? "cursor-pointer hover:bg-accent border border-dashed border-input" : ""
                        )}
                        onClick={() => handleCellClick(record.id, col.name, value)}
                    >
                        {isEditMode ? 'Upload...' : '(Belum ada file)'}
                    </div>
                )
            case 'select':
                return (
                    <div
                        className={cn(
                            "p-2 rounded-md text-xs min-h-[2rem] flex items-center",
                            isEditMode && canEdit ? "cursor-pointer hover:bg-accent border border-transparent hover:border-input" : ""
                        )}
                        onClick={() => handleCellClick(record.id, col.name, value)}
                    >
                        {value ? <Badge variant="outline" className="text-[10px] font-bold bg-background shadow-xs">{value}</Badge> : <span className="text-muted-foreground/40 italic">Pilih...</span>}
                    </div>
                )
            case 'number':
                return (
                    <div
                        className={cn(
                            "text-right p-2 rounded-md text-xs min-h-[2rem] flex items-center justify-end font-mono font-medium",
                            isEditMode && canEdit ? "cursor-pointer hover:bg-accent border border-transparent hover:border-input" : ""
                        )}
                        onClick={() => handleCellClick(record.id, col.name, value)}
                    >
                        {value || '0'}
                    </div>
                )
            default:
                return (
                    <div
                        className={cn(
                            "p-2 rounded-md min-h-[2rem] text-sm text-foreground",
                            isEditMode && canEdit ? "cursor-pointer hover:bg-accent border border-transparent hover:border-input" : ""
                        )}
                        onClick={() => handleCellClick(record.id, col.name, value)}
                    >
                        {value || <span className="text-muted-foreground/30 italic text-xs">Klik untuk isi...</span>}
                    </div>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-input/40 transition-all">
                <div className="relative w-full sm:w-[350px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari data di tabel ini..."
                        className="pl-9 h-10 border-input bg-background shadow-xs focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {canEdit && (
                        <Button
                            variant={isEditMode ? "destructive" : "outline"}
                            size="sm"
                            className={cn(
                                "h-10 px-6 gap-2 font-bold shadow-xs transition-all",
                                !isEditMode && "hover:border-primary hover:text-primary"
                            )}
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? <X className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {isEditMode ? "Matikan Edit" : "Aktifkan Mode Edit"}
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-input/60 bg-card shadow-sm overflow-x-auto ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-input/60">
                            {columns?.map((col) => (
                                <TableHead key={col.id} className="font-extrabold text-foreground h-12 py-3 px-4 text-[11px] uppercase tracking-tight">
                                    {col.name}
                                    {col.is_required && <span className="text-destructive ml-1">*</span>}
                                </TableHead>
                            ))}
                            {isEditMode && (
                                <TableHead className="text-right text-[11px] font-extrabold h-12 py-3 px-4 uppercase tracking-tight">Aksi</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Quick Add Row */}
                        {canInsert && isEditMode && (
                            <TableRow className="bg-primary/[0.03] border-b border-primary/20">
                                {columns?.map((col) => {
                                    const options = getColOptions(col)
                                    return (
                                        <TableCell key={`add-${col.id}`} className="py-4 px-4">
                                            {col.type === 'drive' ? (
                                                <MiniDriveUpload
                                                    scriptUrl={options[0]}
                                                    defaultValue={quickAdd[col.name]}
                                                    isEditMode={isEditMode}
                                                    onUploadSuccess={(url) => setQuickAdd(prev => ({ ...prev, [col.name]: url }))}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder={`${col.name}...`}
                                                    className="h-9 text-xs bg-background border-primary/20 focus-visible:ring-primary shadow-xs"
                                                    value={quickAdd[col.name] || ''}
                                                    onChange={(e) => setQuickAdd(prev => ({ ...prev, [col.name]: e.target.value }))}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                                                    type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                                                />
                                            )}
                                        </TableCell>
                                    )
                                })}
                                <TableCell className="text-right py-4 px-4">
                                    <Button
                                        size="sm"
                                        className="h-9 px-6 gap-2 font-bold shadow-md bg-primary hover:bg-primary/90 transition-all"
                                        onClick={handleQuickAdd}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        Simpan
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}

                        {paginatedRecords?.map((record) => (
                            <TableRow key={record.id} className="group transition-all hover:bg-muted/30 border-b border-input/40">
                                {columns?.map((col) => (
                                    <TableCell key={`${record.id}-${col.id}`} className="py-2 px-4">
                                        {renderCellContent(record, col)}
                                    </TableCell>
                                ))}
                                {isEditMode && (
                                    <TableCell className="text-right py-2 px-4 whitespace-nowrap">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <RecordRowActions
                                                tableId={tableId}
                                                recordId={record.id}
                                                canEdit={canEdit && isEditMode}
                                                canDelete={canDelete && isEditMode}
                                            />
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}

                        {(!filteredRecords || filteredRecords.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={(columns?.length || 0) + (isEditMode ? 1 : 0)} className="h-40 text-center text-muted-foreground/60 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>{searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : (isEditMode ? "Belum ada arsip. Gunakan baris di atas untuk menambah." : "Belum ada data arsip.")}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                    <p className="text-xs text-muted-foreground">
                        Menampilkan <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> dari <strong>{filteredRecords.length}</strong> data
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Sebelumnya
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "h-8 w-8 p-0 text-xs font-bold",
                                        currentPage === page ? "shadow-md scale-105" : "hover:bg-accent"
                                    )}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}

            {searchQuery && filteredRecords.length > 0 && !totalPages && (
                <div className="text-[10px] text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-1">
                    Menampilkan <strong>{filteredRecords.length}</strong> data hasil pencarian.
                </div>
            )}
        </div>
    )
}
