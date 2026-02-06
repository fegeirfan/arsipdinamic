'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteTeam } from './actions'
import { useToast } from '@/hooks/use-toast'

interface DeleteTeamDialogProps {
    teamId: string
    teamName: string
    memberCount: number
    trigger: React.ReactNode
}

export function DeleteTeamDialog({ teamId, teamName, memberCount, trigger }: DeleteTeamDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function handleConfirm() {
        setLoading(true)
        try {
            const result = await deleteTeam(teamId)
            if (result?.error) {
                throw new Error(result.error)
            }
            toast({
                title: 'Berhasil',
                description: `Tim ${teamName} telah dihapus.`,
            })
            setOpen(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal',
                description: error.message || 'Terjadi kesalahan saat menghapus tim.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)}>{trigger}</div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tim?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus tim {teamName}?
                            {memberCount > 0 && (
                                <span className="block mt-2 text-amber-600">
                                    ⚠️ Tim ini memiliki {memberCount} anggota. 
                                    Anggota akan dipindahkan keluar dari tim.
                                </span>
                            )}
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {loading ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
