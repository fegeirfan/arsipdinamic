'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createTeam } from './actions'
import { useToast } from '@/hooks/use-toast'

interface User {
    id: string
    full_name: string | null
    email: string
}

interface CreateTeamDialogProps {
    users: User[]
    onTeamCreated?: (team: { id: string; name: string; description: string | null; pic_id: string | null }) => void
}

export function CreateTeamDialog({ users, onTeamCreated }: CreateTeamDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await createTeam(formData)
            if (result?.error) {
                throw new Error(result.error)
            }
            
            toast({
                title: 'Tim berhasil dibuat',
                description: 'Tim baru telah ditambahkan ke sistem.',
            })
            
            // Generate a temporary team object for optimistic update
            if (onTeamCreated) {
                onTeamCreated({
                    id: crypto.randomUUID(),
                    name: formData.get('name') as string,
                    description: formData.get('description') as string || null,
                    pic_id: (formData.get('pic_id') as string) || null,
                })
            }
            
            setOpen(false)
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Gagal membuat tim',
                description: error.message || 'Terjadi kesalahan saat membuat tim.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Team</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Team Baru</DialogTitle>
                        <DialogDescription>
                            Tentukan nama tim dan tunjuk PIC untuk bertanggung jawab atas tim ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Team</Label>
                            <Input id="name" name="name" placeholder="Contoh: Keuangan" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input id="description" name="description" placeholder="Deskripsi singkat tim..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pic_id">Tunjuk PIC</Label>
                            <Select name="pic_id">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih PIC (Opsional)" />
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan Team'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
