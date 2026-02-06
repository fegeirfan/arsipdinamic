'use server'

import { createClient } from '@/utils/supabase/server'
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

export async function updateUserTeam(userId: string, teamId: string | null) {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    const { error } = await supabase
        .from('profiles')
        .update({ team_id: teamId })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user team:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/teams')
    return { success: true }
}

export async function updateUserRole(userId: string, role: 'admin' | 'staff') {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user role:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    // Verify admin
    await verifyAdmin(supabase)

    // Delete from auth.users (requires admin client)
    // This would need to be done via admin API
    
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

    if (error) {
        console.error('Error deleting user:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
}
