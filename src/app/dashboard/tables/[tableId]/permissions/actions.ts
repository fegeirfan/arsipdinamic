'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type PermissionRow = {
  userId: string
  canView: boolean
  canInsert: boolean
  canEdit: boolean
  canDelete: boolean
  canEditStructure: boolean
}

export async function saveTablePermissions(tableId: string, permissions: PermissionRow[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { data: table } = await supabase
    .from('archive_tables')
    .select('id, team_id, team_pic_id, created_by')
    .eq('id', tableId)
    .single()

  if (!table) return { error: 'Tabel tidak ditemukan.' }

  const { data: team } = table.team_id
    ? await supabase.from('teams').select('pic_id').eq('id', table.team_id).single()
    : { data: null }

  const isAdmin = profile?.role === 'admin'
  const isPic =
    table.team_pic_id === user.id ||
    table.created_by === user.id ||
    team?.pic_id === user.id

  if (!isAdmin && !isPic) return { error: 'Hanya Admin atau PIC tabel ini yang dapat mengubah izin.' }

  for (const row of permissions) {
    const { data: existing } = await supabase
      .from('table_permissions')
      .select('id, can_view, can_insert, can_edit, can_delete, can_edit_structure')
      .eq('table_id', tableId)
      .eq('user_id', row.userId)
      .single()

    const payload = {
      can_view: row.canView,
      can_insert: row.canInsert,
      can_edit: row.canEdit,
      can_delete: row.canDelete,
      can_edit_structure: isAdmin || isPic ? row.canEditStructure : false,
    }

    if (existing) {
      const { error } = await supabase
        .from('table_permissions')
        .update(payload)
        .eq('id', existing.id)
      if (error) {
        console.error('Error updating permission:', error)
        return { error: error.message }
      }
    } else {
      const { error } = await supabase.from('table_permissions').insert({
        table_id: tableId,
        user_id: row.userId,
        ...payload,
      })
      if (error) {
        console.error('Error inserting permission:', error)
        return { error: error.message }
      }
    }
  }

  revalidatePath(`/dashboard/tables/${tableId}/permissions`)
  revalidatePath(`/dashboard/tables/${tableId}`)
  return { success: true }
}
