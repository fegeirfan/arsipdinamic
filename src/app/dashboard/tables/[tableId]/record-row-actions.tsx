'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
import { deleteRecord } from './actions'
import { useToast } from '@/hooks/use-toast'

export function RecordRowActions({
  tableId,
  recordId,
  canEdit,
  canDelete,
}: {
  tableId: string
  recordId: string
  canEdit: boolean
  canDelete: boolean
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteRecord(tableId, recordId)
    setDeleting(false)
    setOpen(false)
    if (result?.error) {
      toast({ title: 'Gagal menghapus', description: result.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Arsip dihapus' })
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/tables/${tableId}/record/${recordId}`}>Detail</Link>
      </Button>
      {canEdit && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/tables/${tableId}/record/${recordId}/edit`}>Edit</Link>
        </Button>
      )}
      {canDelete && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Hapus
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus arsip?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Data arsip akan dihapus permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground">
                {deleting ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
