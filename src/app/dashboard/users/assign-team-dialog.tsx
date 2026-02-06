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
import { updateUserTeam } from './actions-team'
import { useToast } from '@/hooks/use-toast'

interface AssignTeamDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    userName: string
    currentTeamId: string | null
    teams: { id: string; name: string }[]
}

export function AssignTeamDialog({
    open,
    onOpenChange,
    userId,
    userName,
    currentTeamId,
    teams,
}: AssignTeamDialogProps) {
    const [loading, setLoading] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<string>(currentTeamId || 'none')
    const router = useRouter()
    const { toast } = useToast()

    async function handleSubmit() {
        setLoading(true)
        try {
            const teamId = selectedTeam === 'none' ? null : selectedTeam
            const result = await updateUserTeam(userId, teamId)
            if (result?.error) {
                throw new Error(result.error)
            }
            toast({
                title: 'Berhasil',
                description: `Tim untuk ${userName} telah diperbarui.`,
            })
            onOpenChange(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal',
                description: error.message || 'Terjadi kesalahan saat memperbarui tim.',
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
                    <DialogTitle>Assign Team</DialogTitle>
                    <DialogDescription>
                        Tentukan tim untuk pengguna {userName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Pilih Tim</label>
                        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Tim" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tanpa Tim</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.name}
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
