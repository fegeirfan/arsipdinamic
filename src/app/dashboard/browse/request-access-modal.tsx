'use client'

import { useState } from 'react'
import { Lock, Send } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { requestAccess } from './actions'
import { useToast } from '@/hooks/use-toast'

export function RequestAccessModal({ tableId, tableName }: { tableId: string, tableName: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const level = formData.get('level') as 'view' | 'insert'
        const notes = formData.get('notes') as string

        try {
            const result = await requestAccess(tableId, level, notes)
            if (result?.error) throw new Error(result.error)

            toast({
                title: 'Permintaan Terkirim',
                description: `Permintaan akses ke ${tableName} telah dikirim ke PIC/Admin.`,
            })
            setOpen(false)
        } catch (error: any) {
            toast({
                title: 'Gagal mengirim permintaan',
                description: error.message,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 border-amber-500/30 hover:bg-amber-500/10 text-amber-600">
                    <Lock className="h-3.5 w-3.5" />
                    Minta Akses
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Minta Akses Tabel</DialogTitle>
                        <DialogDescription>
                            Tabel <strong>{tableName}</strong> terkunci. Anda dapat meminta izin akses ke PIC tim pemilik tabel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="level">Level Akses</Label>
                            <Select name="level" defaultValue="view" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Level Akses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="view">👁️ View (Hanya Lihat)</SelectItem>
                                    <SelectItem value="insert">➕ Insert (Tambah Data)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Catatan / Alasan</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Jelaskan mengapa Anda membutuhkan akses ke tabel ini..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? 'Mengirim...' : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Kirim Permintaan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
