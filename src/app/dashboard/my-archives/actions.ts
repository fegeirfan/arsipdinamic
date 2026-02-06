'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Validate that user is PIC for the given team
 */
async function validatePicForTeam(teamId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: team } = await supabase
        .from('teams')
        .select('pic_id')
        .eq('id', teamId)
        .single()

    return team?.pic_id === user.id
}

/**
 * Validate that user is PIC/creator for the given table
 */
async function validateTableOwnership(tableId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'admin') return true

    // Check if PIC for the table
    const { data: table } = await supabase
        .from('archive_tables')
        .select('id, team_id, team_pic_id, created_by')
        .eq('id', tableId)
        .single()

    if (!table) return false
    if (table.team_pic_id === user.id || table.created_by === user.id) return true

    // Check if PIC of the team
    if (table.team_id) {
        const { data: team } = await supabase
            .from('teams')
            .select('pic_id')
            .eq('id', table.team_id)
            .single()
        if (team?.pic_id === user.id) return true
    }

    return false
}

/**
 * Create a new archive table from My Archives page (PIC only)
 */
export async function createTableFromMyArchives(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const teamId = formData.get('teamId') as string
    const picId = formData.get('picId') as string
    const visibility = formData.get('visibility') as string

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Admin can create for any team, PIC only for their own team
    if (!isAdmin) {
        const isValidPic = await validatePicForTeam(teamId)
        if (!isValidPic) {
            throw new Error('Anda tidak memiliki izin untuk membuat tabel di tim ini')
        }

        // PIC can only set themselves as PIC (not other users)
        if (picId !== user.id) {
            throw new Error('PIC tabel harus diri Anda sendiri')
        }
    }

    const { data: newTable, error } = await supabase
        .from('archive_tables')
        .insert({
            name,
            description,
            team_id: teamId || null,
            team_pic_id: picId,
            visibility,
            created_by: user.id,
            pic_ids: [picId],
        })
        .select()
        .single()

    if (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating table:', error)
        // Provide more specific error message
        if (error.message.includes('null value in column "team_id"')) {
            throw new Error('Team tidak valid. Silakan pilih team yang tersedia.')
        }
        if (error.message.includes('violates row level security policy')) {
            throw new Error('Anda tidak memiliki izin untuk membuat tabel di team ini. Pastikan Anda adalah PIC team tersebut.')
        }
        throw new Error('Gagal membuat tabel: ' + error.message)
    }

    revalidatePath('/dashboard/my-archives')
    redirect(`/dashboard/tables/${newTable.id}/builder`)
}

/**
 * Update archive table info from My Archives page (PIC only)
 */
export async function updateTableFromMyArchives(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const tableId = formData.get('tableId') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const visibility = formData.get('visibility') as string

    // Validate ownership
    const hasAccess = await validateTableOwnership(tableId)
    if (!hasAccess) {
        throw new Error('Anda tidak memiliki izin untuk mengedit tabel ini')
    }

    const { error } = await supabase
        .from('archive_tables')
        .update({
            name,
            description,
            visibility,
        })
        .eq('id', tableId)

    if (error) {
        console.error('Error updating table:', error)
        throw new Error('Gagal mengupdate tabel')
    }

    revalidatePath('/dashboard/my-archives')
    revalidatePath(`/dashboard/tables/${tableId}`)
    redirect('/dashboard/my-archives')
}

/**
 * Delete archive table from My Archives page (PIC only)
 */
export async function deleteTableFromMyArchives(tableId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Validate ownership
    const hasAccess = await validateTableOwnership(tableId)
    if (!hasAccess) {
        throw new Error('Anda tidak memiliki izin untuk menghapus tabel ini')
    }

    const { error } = await supabase
        .from('archive_tables')
        .delete()
        .eq('id', tableId)

    if (error) {
        console.error('Error deleting table:', error)
        throw new Error('Gagal menghapus tabel')
    }

    revalidatePath('/dashboard/my-archives')
}
