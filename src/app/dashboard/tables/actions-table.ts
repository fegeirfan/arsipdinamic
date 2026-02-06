'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArchiveTable(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const { data: picTeams } = await supabase.from('teams').select('id').eq('pic_id', user.id)
    const picTeamIds = picTeams?.map((t) => t.id) ?? []

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const teamId = formData.get('teamId') as string
    const picId = formData.get('picId') as string
    const visibility = formData.get('visibility') as string

    if (!isAdmin) {
        if (picTeamIds.length === 0) return { error: 'Hanya Admin atau PIC tim yang dapat membuat tabel.' }
        if (!picTeamIds.includes(teamId)) return { error: 'Anda hanya dapat membuat tabel untuk tim yang Anda pimpin.' }
    }

    const effectivePicId = !isAdmin ? user.id : picId
    const payload: Record<string, unknown> = {
        name,
        description: description || null,
        team_id: teamId,
        team_pic_id: effectivePicId,
        visibility: visibility || 'private',
        created_by: user.id,
    }

    const { data, error } = await supabase
        .from('archive_tables')
        .insert(payload)
        .select()
        .single()

    if (error) {
        console.error('Error creating table:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/tables')
    redirect(`/dashboard/tables/${data.id}/builder`)
}

export async function deleteArchiveTable(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const { data: table } = await supabase.from('archive_tables').select('team_id, team_pic_id, created_by').eq('id', id).single()
    if (!table) return { error: 'Tabel tidak ditemukan.' }
    const isPic =
        table.team_pic_id === user.id ||
        table.created_by === user.id ||
        (table.team_id
            ? (await supabase.from('teams').select('pic_id').eq('id', table.team_id).single()).data?.pic_id === user.id
            : false)
    if (!isAdmin && !isPic) return { error: 'Hanya Admin atau PIC tabel ini yang dapat menghapus tabel.' }

    const { error } = await supabase
        .from('archive_tables')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting table:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/tables')
    return { success: true }
}
