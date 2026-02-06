'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateTeamPic } from './actions'
import { useToast } from '@/hooks/use-toast'

interface AssignPicDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
    teamName: string
    currentPicId: string | null
    users: { id: string; full_name: string | null; email: string }[]
}

export function AssignPicDialog({
    open,
    onOpenChange,
    teamId,
    teamName,
    currentPicId,
    users,
}: AssignPicDialogProps) {
    const [loading, setLoading] = useState(false)
    const [selectedPic, setSelectedPic] = useState(currentPicId || '')
    const router = useRouter()
    const { toast } = useToast()

    async function handleSubmit() {
        if (!selectedPic) {
            toast({
                title: 'Pilih PIC',
                description: 'Silakan pilih seorang PIC untuk tim ini.',
                variant: 'destructive',
            })
            return
        }

        setLoading(true)
        try {
            const result = await updateTeamPic(teamId, selectedPic)
            if (result?.error) {
                throw new Error(result.error)
            }
            toast({
                title: 'Berhasil',
                description: `PIC untuk tim ${teamName} telah diperbarui.`,
            })
            onOpenChange(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal',
                description: error.message || 'Terjadi kesalahan saat memperbarui PIC.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign PIC</DialogTitle>
                    <DialogDescription>
                        Tunjuk Person In Charge (PIC) untuk tim {teamName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Pilih PIC</label>
                        <Select value={selectedPic} onValueChange={setSelectedPic}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih PIC" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.full_name || user.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
