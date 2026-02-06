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
import { createArchiveTable } from '../actions-table'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPicTeamIds } from '@/lib/auth-pic'

export default async function CreateTablePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  const picTeamIds = await getPicTeamIds()
  const isPic = picTeamIds.length > 0
  if (!isAdmin && !isPic) redirect('/dashboard/my-team')

  // Admin: semua tim. PIC: hanya tim yang dipimpinnya.
  const { data: allTeams } = await supabase.from('teams').select('id, name')
  const teams = isAdmin ? allTeams ?? [] : (allTeams ?? []).filter((t) => picTeamIds.includes(t.id))
  if (!isAdmin && teams.length === 0) redirect('/dashboard/tables')

  // Fetch users for PIC selection (admin bisa pilih siapa saja; PIC default diri sendiri)
  const { data: users } = await supabase.from('profiles').select('id, full_name, email')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-sidebar-accent">Buat Tabel Arsip Baru</h1>
        <p className="text-muted-foreground">Tentukan struktur kepemilikan dan visibilitas tabel.</p>
      </div>

      <Card className="border-sidebar-accent/10">
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>
            Nama dan deskripsi tabel akan muncul di dashboard pengguna tim terkait.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createArchiveTable} className="space-y-6">
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
                      {teams?.map((team) => (
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
                  <Select name="picId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih PIC" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.full_name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">PIC bertanggung jawab atas pengelolaan struktur & data tabel. {isPic && !isAdmin && 'Anda sebagai PIC tim otomatis menjadi PIC tabel.'}</p>
                </div>
              </div>
            </div>

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
                <Link href="/dashboard/tables">Batal</Link>
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
          Setelah tabel dibuat, Anda akan diarahkan ke **Table Builder** untuk menentukan kolom-kolom data yang diperlukan.
        </p>
      </div>
    </div>
  )
}
