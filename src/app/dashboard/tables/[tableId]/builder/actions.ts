'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ColumnDef = {
    id?: string
    name: string
    type: 'text' | 'number' | 'date' | 'select' | 'file' | 'drive'
    options?: string[]
    is_required: boolean
}

async function validateTableAccess(tableId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Check admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'admin') return true

    // Check table ownership/PIC
    const { data: table } = await supabase
        .from('archive_tables')
        .select('created_by, team_pic_id, team_id')
        .eq('id', tableId)
        .single()

    if (!table) return false

    if (table.created_by === user.id || table.team_pic_id === user.id) return true

    // Check team PIC
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

export async function saveTableStructure(tableId: string, columns: ColumnDef[], deletedColumnIds: string[]) {
    const supabase = await createClient()

    // Validate access
    const hasAccess = await validateTableAccess(tableId)
    if (!hasAccess) {
        throw new Error('Unauthorized')
    }

    // 1. Delete removed columns
    if (deletedColumnIds.length > 0) {
        const { error: deleteError } = await supabase
            .from('archive_columns')
            .delete()
            .in('id', deletedColumnIds)
            .eq('table_id', tableId) // Safety check

        if (deleteError) {
            console.error('Error deleting columns:', deleteError)
            throw new Error('Failed to delete columns: ' + deleteError.message)
        }
    }

    // 2. Upsert columns
    for (const col of columns) {
        const payload: any = {
            table_id: tableId,
            name: col.name,
            type: col.type,
            is_required: col.is_required,
            options: col.options ? JSON.stringify(col.options) : '[]' // Store as JSON string or JSONB? Schema says JSONB.
        }

        // If it has a real UUID, update it. If it's new (no ID or temp ID), insert it.
        if (col.id && col.id.length > 10 && !col.id.startsWith('temp-')) {
            payload.id = col.id
        }

        // We use upsert. If ID is present, it updates. If not, it inserts.
        // But for insert we need to NOT pass a fake ID.
        // If ID is missing, Supabase gen_random_uuid() handles it.

        const { error } = await supabase
            .from('archive_columns')
            .upsert(payload, { onConflict: 'id' })

        if (error) {
            console.error('Error saving column:', error)
            throw new Error(`Failed to save column ${col.name}: ` + error.message)
        }
    }

    revalidatePath(`/dashboard/tables/${tableId}/builder`)
    revalidatePath(`/dashboard/tables/${tableId}`)
    return { success: true }
}
