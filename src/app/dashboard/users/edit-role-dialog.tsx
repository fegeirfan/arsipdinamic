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
import { updateUserRole } from './actions-team'
import { useToast } from '@/hooks/use-toast'

interface EditRoleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    userName: string
    currentRole: string
}

export function EditRoleDialog({
    open,
    onOpenChange,
    userId,
    userName,
    currentRole,
}: EditRoleDialogProps) {
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState(currentRole)
    const router = useRouter()
    const { toast } = useToast()

    async function handleSubmit() {
        setLoading(true)
        try {
            const result = await updateUserRole(userId, selectedRole as 'admin' | 'staff')
            if (result?.error) {
                throw new Error(result.error)
            }
            toast({
                title: 'Berhasil',
                description: `Role untuk ${userName} telah diperbarui menjadi ${selectedRole}.`,
            })
            onOpenChange(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal',
                description: error.message || 'Terjadi kesalahan saat memperbarui role.',
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
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Ubah role pengguna {userName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Pilih Role</label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Admin memiliki akses penuh ke semua fitur.
                        </p>
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
