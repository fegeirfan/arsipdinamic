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
import { createTableFromMyArchives } from '../actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Users, User } from 'lucide-react'

export default async function CreateTableFromMyArchivesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch teams where user is PIC
    const { data: picTeams } = await supabase
        .from('teams')
        .select('id, name')
        .eq('pic_id', user.id)

    const isPic = (picTeams?.length ?? 0) > 0
    const picTeam = picTeams?.[0] // PIC's first team (usually only one)

    // Only PIC and admin can access this page
    if (!isPic && !isAdmin) {
        redirect('/dashboard/my-archives')
    }

    // For Admin: fetch all teams and users for selection
    let allTeams: { id: string; name: string }[] = []
    let allUsers: { id: string; full_name: string | null; email: string | null }[] = []

    if (isAdmin) {
        const { data: teams } = await supabase.from('teams').select('id, name')
        const { data: users } = await supabase.from('profiles').select('id, full_name, email')
        allTeams = teams ?? []
        allUsers = users ?? []
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-sidebar-accent">Buat Tabel Arsip Baru</h1>
                <p className="text-muted-foreground">
                    {isAdmin
                        ? 'Tentukan struktur kepemilikan dan visibilitas tabel.'
                        : 'Tabel akan otomatis ditambahkan ke tim Anda.'}
                </p>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>
                        Nama dan deskripsi tabel akan muncul di dashboard pengguna tim terkait.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createTableFromMyArchives} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Tabel</Label>
                                <Input id="name" name="name" placeholder="Contoh: Arsip Surat Masuk 2024" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea id="description" name="description" placeholder="Penjelasan singkat mengenai isi tabel ini..." />
                            </div>
                        </div>

                        <hr className="border-sidebar-accent/5" />

                        {/* For PIC: Auto-assign team and PIC */}
                        {!isAdmin && picTeam && (
                            <>
                                <input type="hidden" name="teamId" value={picTeam.id} />
                                <input type="hidden" name="picId" value={user.id} />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-sidebar-accent uppercase tracking-wider">Kepemilikan (Otomatis)</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="p-3 bg-muted/30 rounded-lg border border-sidebar-accent/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="h-4 w-4 text-sidebar-accent" />
                                                <span className="text-sm font-medium">Tim</span>
                                            </div>
                                            <Badge variant="secondary" className="text-sm">
                                                {picTeam.name}
                                            </Badge>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg border border-sidebar-accent/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-4 w-4 text-sidebar-accent" />
                                                <span className="text-sm font-medium">PIC Tabel</span>
                                            </div>
                                            <Badge variant="secondary" className="text-sm">
                                                {profile?.full_name || profile?.email || 'Anda'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        Tabel akan otomatis dimiliki oleh tim Anda dengan Anda sebagai PIC.
                                    </p>
                                </div>
                            </>
                        )}

                        {/* For Admin: Show selection dropdowns */}
                        {isAdmin && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-sidebar-accent uppercase tracking-wider">Governance & Ownership</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="teamId">Pilih Team Pemilik</Label>
                                        <Select name="teamId" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allTeams?.map((team) => (
                                                    <SelectItem key={team.id} value={team.id}>
                                                        {team.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground">Data hanya dapat diakses otomatis oleh anggota tim ini.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="picId">Tunjuk PIC Tabel</Label>
                                        <Select name="picId" defaultValue={user.id} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih PIC" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allUsers?.map((u) => (
                                                    <SelectItem key={u.id} value={u.id}>
                                                        {u.full_name || u.email} {u.id === user.id && '(Anda)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground">PIC bertanggung jawab atas pengelolaan struktur & data tabel.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="visibility">Tingkat Visibilitas</Label>
                            <Select name="visibility" defaultValue="private" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Visibilitas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">🔒 Private (Hanya Tim & Admin)</SelectItem>
                                    <SelectItem value="public">🌐 Public (Dapat dilihat oleh semua unit)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button type="button" variant="ghost" asChild>
                                <Link href="/dashboard/my-archives">Batal</Link>
                            </Button>
                            <Button type="submit" className="bg-sidebar-accent hover:bg-sidebar-accent/90 px-8">
                                Lanjut ke Builder
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
                <p className="text-sm text-amber-500 font-medium">💡 Informasi:</p>
                <p className="text-sm text-muted-foreground">
                    Setelah tabel dibuat, Anda akan diarahkan ke <strong>Table Builder</strong> untuk menentukan kolom-kolom data yang diperlukan.
                </p>
            </div>
        </div>
    )
}
