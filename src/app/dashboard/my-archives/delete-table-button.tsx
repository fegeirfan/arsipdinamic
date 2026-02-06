'use client'

import { Trash2 } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteTableFromMyArchives } from './actions'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteTableButtonProps {
    tableId: string
    tableName: string
}

export function DeleteTableButton({ tableId, tableName }: DeleteTableButtonProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteTableFromMyArchives(tableId)
                router.refresh()
            } catch (error) {
                console.error('Error deleting table:', error)
                alert('Gagal menghapus tabel')
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus Tabel
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tabel</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus tabel <strong>&quot;{tableName}&quot;</strong>?
                        Semua data arsip di dalam tabel ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? 'Menghapus...' : 'Ya, Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
