'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Helper function to verify admin status
 */
async function verifyAdmin(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        throw new Error('Unauthorized: Authentication required')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Forbidden: Admin access required')
    }

    return user
}

export async function createTeam(formData: FormData) {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const pic_id = (formData.get('pic_id') as string) || null

    const { error } = await supabase.from('teams').insert({
        name,
        description,
        pic_id
    })

    if (error) {
        console.error('Error creating team:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/teams')
    return { success: true }
}

export async function updateTeamPic(teamId: string, picId: string) {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    const { error } = await supabase
        .from('teams')
        .update({ pic_id: picId })
        .eq('id', teamId)

    if (error) {
        console.error('Error updating team PIC:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/teams')
    return { success: true }
}

export async function deleteTeam(teamId: string) {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

    if (error) {
        console.error('Error deleting team:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/teams')
    return { success: true }
}
