import { createClient } from '@/utils/supabase/server'

/**
 * Cek apakah user saat ini adalah PIC (Person In Charge) dari minimal satu tim.
 * PIC = teams.pic_id = user.id
 */
export async function isUserPic(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: teams } = await supabase
    .from('teams')
    .select('id')
    .eq('pic_id', user.id)
  return (teams?.length ?? 0) > 0
}

/**
 * Cek apakah user punya otoritas PIC untuk tabel tertentu.
 * True jika: admin, atau table.team_pic_id = user, atau table.created_by = user, atau table's team.pic_id = user.
 */
export async function isTablePic(tableId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'admin') return true

  const { data: table } = await supabase
    .from('archive_tables')
    .select('id, team_id, team_pic_id, created_by')
    .eq('id', tableId)
    .single()
  if (!table) return false
  if (table.team_pic_id === user.id || table.created_by === user.id) return true
  if (table.team_id) {
    const { data: team } = await supabase.from('teams').select('pic_id').eq('id', table.team_id).single()
    if (team?.pic_id === user.id) return true
  }
  return false
}

/**
 * Ambil daftar team_id yang user adalah PIC-nya (untuk dropdown "Pilih Team" saat PIC buat tabel).
 */
export async function getPicTeamIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: teams } = await supabase.from('teams').select('id').eq('pic_id', user.id)
  return teams?.map((t) => t.id) ?? []
}
