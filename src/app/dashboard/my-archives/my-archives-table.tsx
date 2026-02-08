'use client'

import { useState, useEffect } from 'react'
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
import {
    Search,
    Table as TableIcon,
    Globe,
    Lock,
    Eye,
    Settings2,
    Pencil,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteTableButton } from './delete-table-button'
import { cn } from '@/lib/utils'

interface TableData {
    id: string
    name: string
    description: string | null
    visibility: string
    created_at: string
    team?: {
        id: string
        name: string
        pic_id: string
    } | null
}

export function MyArchivesTable({
    initialTables,
    userId,
    isAdmin
}: {
    initialTables: any[]
    userId: string
    isAdmin: boolean
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const filteredTables = initialTables.filter(table => {
        if (!searchQuery) return true
        const lowQuery = searchQuery.toLowerCase()
        return (
            table.name.toLowerCase().includes(lowQuery) ||
            table.description?.toLowerCase().includes(lowQuery) ||
            table.team?.name?.toLowerCase().includes(lowQuery)
        )
    })

    const totalPages = Math.ceil(filteredTables.length / itemsPerPage)
    const paginatedTables = filteredTables.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const canManageTable = (table: any) => {
        if (isAdmin) return true
        if (table.team_pic_id === userId) return true
        if (table.created_by === userId) return true
        if (table.team?.pic_id === userId) return true
        return false
    }

    return (
        <div className="space-y-4">
            <div className="relative w-full sm:w-[400px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari tabel arsip..."
                    className="pl-9 h-11 bg-background border-input/60 shadow-xs focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-xl border border-input/60 bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-extrabold text-[11px] uppercase tracking-wider h-12 px-4">Nama Tabel</TableHead>
                            <TableHead className="font-extrabold text-[11px] uppercase tracking-wider h-12 px-4">Tim</TableHead>
                            <TableHead className="font-extrabold text-[11px] uppercase tracking-wider h-12 px-4">Visibilitas</TableHead>
                            <TableHead className="font-extrabold text-[11px] uppercase tracking-wider h-12 px-4">Dibuat</TableHead>
                            <TableHead className="text-right font-extrabold text-[11px] uppercase tracking-wider h-12 px-4">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTables.map((table) => {
                            const isManager = canManageTable(table)
                            const isPic = table.team_pic_id === userId || table.team?.pic_id === userId

                            return (
                                <TableRow key={table.id} className="group hover:bg-muted/30 transition-all border-b border-input/40">
                                    <TableCell className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <TableIcon className="h-4 w-4 text-primary" />
                                                <span className="font-bold text-sm">{table.name}</span>
                                                {isPic && (
                                                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">PIC</Badge>
                                                )}
                                            </div>
                                            {table.description && (
                                                <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[300px]">{table.description}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge variant="secondary" className="text-[10px] font-medium bg-muted/60">
                                            {table.team?.name || 'TANPA TIM'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-1.5">
                                            {table.visibility === 'public' ? (
                                                <Globe className="h-3.5 w-3.5 text-blue-500" />
                                            ) : (
                                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{table.visibility}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                            {new Date(table.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild size="sm" variant="outline" className="h-8 px-3 gap-2 text-xs font-bold hover:border-primary hover:text-primary transition-all">
                                                <Link href={`/dashboard/tables/${table.id}`}>
                                                    <Eye className="h-3.5 w-3.5" /> Buka
                                                </Link>
                                            </Button>

                                            {isManager && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Pengaturan Tabel</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/tables/${table.id}/builder`} className="cursor-pointer text-xs">
                                                                <Settings2 className="mr-2 h-4 w-4" /> Struktur Kolom
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/my-archives/${table.id}/edit`} className="cursor-pointer text-xs">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit Informasi
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DeleteTableButton tableId={table.id} tableName={table.name} />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {filteredTables.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground italic">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>{searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada tabel arsip."}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                    <p className="text-[11px] text-muted-foreground">
                        Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "h-9 w-9 p-0 text-xs font-bold",
                                        currentPage === page ? "shadow-md" : "hover:bg-accent"
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
                            className="h-9 w-9 p-0"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
