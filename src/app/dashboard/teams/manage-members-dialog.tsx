'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { updateUserTeam } from '../users/actions-team'
import { useToast } from '@/hooks/use-toast'

interface ManageMembersDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
    teamName: string
    allUsers: { id: string; full_name: string | null; email: string; team_id: string | null }[]
    currentMembers: string[]
}

export function ManageMembersDialog({
    open,
    onOpenChange,
    teamId,
    teamName,
    allUsers,
    currentMembers,
}: ManageMembersDialogProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        setSelectedUsers(currentMembers)
    }, [currentMembers])

    function handleToggle(userId: string) {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    async function handleSubmit() {
        setLoading(true)
        try {
            // Get users who were removed from the team
            const removedUsers = currentMembers.filter((id) => !selectedUsers.includes(id))
            
            // Update each user that was added
            const addedUsers = selectedUsers.filter((id) => !currentMembers.includes(id))

            // Remove members from this team
            for (const userId of removedUsers) {
                await updateUserTeam(userId, null)
            }

            // Add members to this team
            for (const userId of addedUsers) {
                await updateUserTeam(userId, teamId)
            }

            toast({
                title: 'Berhasil',
                description: `Anggota tim ${teamName} telah diperbarui.`,
            })
            onOpenChange(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal',
                description: error.message || 'Terjadi kesalahan saat memperbarui anggota.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const usersWithoutTeam = allUsers.filter((u) => !u.team_id || u.team_id === teamId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kelola Anggota</DialogTitle>
                    <DialogDescription>
                        Tambah atau hapus anggota dari tim {teamName}.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="space-y-3">
                        {usersWithoutTeam.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Tidak ada user yang tersedia.
                            </p>
                        ) : (
                            usersWithoutTeam.map((user) => (
                                <div key={user.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={user.id}
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={() => handleToggle(user.id)}
                                    />
                                    <label
                                        htmlFor={user.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {user.full_name || user.email}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
