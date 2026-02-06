'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function requestAccess(tableId: string, level: 'view' | 'insert', notes: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Fetch the target team ID for the table (needed for RLS check without recursion)
    const { data: tableData } = await supabase
        .from('archive_tables')
        .select('team_id')
        .eq('id', tableId)
        .single()

    const { error } = await supabase
        .from('access_requests')
        .insert({
            user_id: user.id,
            table_id: tableId,
            target_team_id: tableData?.team_id,
            requested_level: level,
            notes,
            status: 'pending'
        })

    if (error) {
        console.error('Error requesting access:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/browse')
    return { success: true }
}
