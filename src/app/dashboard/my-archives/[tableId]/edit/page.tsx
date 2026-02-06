import { createClient } from '@/utils/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { updateTableFromMyArchives } from '../../actions'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditTablePage(props: {
    params: Promise<{ tableId: string }>
}) {
    const params = await props.params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'

    // Fetch the table
    const { data: table } = await supabase
        .from('archive_tables')
        .select('*, team:teams(id, name, pic_id)')
        .eq('id', params.tableId)
        .single()

    if (!table) {
        notFound()
    }

    // Check if user has permission to edit this table
    const canEdit =
        isAdmin ||
        table.team_pic_id === user.id ||
        table.created_by === user.id ||
        (table.team as { pic_id?: string } | null)?.pic_id === user.id

    if (!canEdit) {
        redirect('/dashboard/my-archives')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/my-archives">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sidebar-accent">Edit Tabel</h1>
                    <p className="text-muted-foreground">Ubah informasi dasar tabel arsip.</p>
                </div>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Informasi Tabel</CardTitle>
                    <CardDescription>
                        Perubahan akan berlaku langsung setelah disimpan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateTableFromMyArchives} className="space-y-6">
                        <input type="hidden" name="tableId" value={table.id} />

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Tabel</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={table.name}
                                    placeholder="Contoh: Arsip Surat Masuk 2024"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={table.description || ''}
                                    placeholder="Penjelasan singkat mengenai isi tabel ini..."
                                />
                            </div>
                        </div>

                        <hr className="border-sidebar-accent/5" />

                        <div className="space-y-2">
                            <Label htmlFor="visibility">Tingkat Visibilitas</Label>
                            <Select name="visibility" defaultValue={table.visibility} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Visibilitas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">🔒 Private (Hanya Tim & Admin)</SelectItem>
                                    <SelectItem value="public">🌐 Public (Dapat dilihat oleh semua unit)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-3 bg-muted/30 rounded-lg border border-sidebar-accent/10">
                            <p className="text-sm text-muted-foreground">
                                <strong>Tim:</strong> {table.team?.name || 'Tidak ada tim'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Untuk mengubah tim tabel, hubungi administrator.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button type="button" variant="ghost" asChild>
                                <Link href="/dashboard/my-archives">Batal</Link>
                            </Button>
                            <Button type="submit" className="bg-sidebar-accent hover:bg-sidebar-accent/90 px-8">
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
