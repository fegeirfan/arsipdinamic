'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processAccessRequest(requestId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('access_requests')
        .update({
            status,
            processed_by: user.id,
            updated_at: new foreign_now() // Just an indicator, DB has default
        })
        .eq('id', requestId)

    if (error) {
        console.error('Error processing access request:', error)
        return { error: error.message }
    }

    // If approved, we might need to update public.table_permissions or similar
    // For now, let's assume the RLS handles it or we'll implement a permission sync

    revalidatePath('/dashboard/access')
    return { success: true }
}

function foreign_now() {
    return new Date().toISOString()
}
