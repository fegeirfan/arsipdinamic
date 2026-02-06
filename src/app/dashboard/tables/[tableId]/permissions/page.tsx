import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PermissionsClient } from './permissions-client'

export default async function TablePermissionsPage(props: {
  params: Promise<{ tableId: string }>
}) {
  const { tableId } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { data: table } = await supabase
    .from('archive_tables')
    .select('id, name, team_id, team_pic_id, created_by')
    .eq('id', tableId)
    .single()

  if (!table) return <div>Tabel tidak ditemukan.</div>

  const { data: team } = table.team_id
    ? await supabase.from('teams').select('pic_id').eq('id', table.team_id).single()
    : { data: null }

  const isAdmin = profile?.role === 'admin'
  const isPic =
    table.team_pic_id === user.id ||
    table.created_by === user.id ||
    team?.pic_id === user.id

  if (!isAdmin && !isPic) redirect('/dashboard/tables')

  const { data: perms } = await supabase
    .from('table_permissions')
    .select('*')
    .eq('table_id', tableId)

  const picUserIds = new Set<string>()
  if (table.team_pic_id) picUserIds.add(table.team_pic_id)
  if (table.created_by) picUserIds.add(table.created_by)
  if (team?.pic_id) picUserIds.add(team.pic_id)

  const userIds = new Set<string>(picUserIds)
  perms?.forEach((p) => userIds.add(p.user_id))

  // Include all team members and admins so PIC can assign permissions
  const { data: teamProfiles } = table.team_id
    ? await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('team_id', table.team_id)
    : { data: [] }
  const { data: adminProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, avatar_url')
    .eq('role', 'admin')

  const allProfiles = new Map<string, { id: string; full_name: string | null; email: string | null; role: string; avatar_url: string | null }>()
  teamProfiles?.forEach((p) => allProfiles.set(p.id, p))
  adminProfiles?.forEach((p) => allProfiles.set(p.id, p))
  const permUserIds = perms?.map((p) => p.user_id).filter((id) => !allProfiles.has(id)) ?? []
  if (permUserIds.length > 0) {
    const { data: extra } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, avatar_url')
      .in('id', permUserIds)
    extra?.forEach((p) => allProfiles.set(p.id, p))
  }
  const profilesToShow = Array.from(allProfiles.values())

  const initialPermissions = profilesToShow.map((p) => {
    const isPicUser = picUserIds.has(p.id)
    const explicit = perms?.find((perm) => perm.user_id === p.id)
    return {
      userId: p.id,
      fullName: p.full_name ?? p.email ?? p.id,
      email: p.email,
      role: p.role,
      avatarUrl: p.avatar_url ?? null,
      isPic: isPicUser || p.role === 'admin',
      canView: p.role === 'admin' ? true : (explicit?.can_view ?? isPicUser),
      canInsert: p.role === 'admin' ? true : (explicit?.can_insert ?? isPicUser),
      canEdit: p.role === 'admin' ? true : (explicit?.can_edit ?? isPicUser),
      canDelete: p.role === 'admin' ? true : (explicit?.can_delete ?? isPicUser),
      canEditStructure: p.role === 'admin' ? true : (explicit?.can_edit_structure ?? isPicUser),
      disabled: p.role === 'admin',
    }
  })

  return (
    <PermissionsClient
      tableId={tableId}
      tableName={table.name}
      initialPermissions={initialPermissions}
      canEditStructure={isAdmin || isPic}
    />
  )
}
