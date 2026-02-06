'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processAccessRequest(requestId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: request } = await supabase
        .from('access_requests')
        .select('user_id, table_id, requested_level')
        .eq('id', requestId)
        .single()

    if (!request) {
        return { error: 'Permintaan tidak ditemukan.' }
    }

    const { error } = await supabase
        .from('access_requests')
        .update({
            status,
            processed_by: user.id,
            updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)

    if (error) {
        console.error('Error processing access request:', error)
        return { error: error.message }
    }

    if (status === 'approved') {
        const canView = true
        const canInsert = request.requested_level === 'insert'
        const { data: existing } = await supabase
            .from('table_permissions')
            .select('id')
            .eq('table_id', request.table_id)
            .eq('user_id', request.user_id)
            .single()
        if (existing) {
            const { error: permError } = await supabase
                .from('table_permissions')
                .update({
                    can_view: canView,
                    can_insert: canInsert,
                })
                .eq('id', existing.id)
            if (permError) {
                console.error('Error syncing table_permissions:', permError)
                return { error: 'Akses disetujui tetapi izin gagal disinkronkan.' }
            }
        } else {
            const { error: permError } = await supabase.from('table_permissions').insert({
                table_id: request.table_id,
                user_id: request.user_id,
                can_view: canView,
                can_insert: canInsert,
                can_edit: false,
                can_delete: false,
                can_edit_structure: false,
            })
            if (permError) {
                console.error('Error syncing table_permissions:', permError)
                return { error: 'Akses disetujui tetapi izin gagal disinkronkan.' }
            }
        }
    }

    revalidatePath('/dashboard/access')
    return { success: true }
}
