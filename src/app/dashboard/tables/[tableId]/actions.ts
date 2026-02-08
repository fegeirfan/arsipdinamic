'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRecord(tableId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: columns } = await supabase
        .from('archive_columns')
        .select('name')
        .eq('table_id', tableId)

    const recordData: Record<string, any> = {}
    columns?.forEach((col) => {
        const value = formData.get(col.name)
        recordData[col.name] = value
    })

    const { data: record, error } = await supabase.from('archive_records').insert({
        table_id: tableId,
        data: recordData,
        created_by: user.id,
    }).select().single()

    if (error) {
        console.error('Error creating record:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/tables/${tableId}`)
    return { success: true, data: record }
}

export async function deleteRecord(tableId: string, recordId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('archive_records')
        .delete()
        .eq('id', recordId)
        .eq('table_id', tableId)

    if (error) {
        console.error('Error deleting record:', error)
        return { error: error.message }
    }
    revalidatePath(`/dashboard/tables/${tableId}`)
    return { success: true }
}

export async function updateRecord(tableId: string, recordId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: columns } = await supabase
        .from('archive_columns')
        .select('name')
        .eq('table_id', tableId)

    const recordData: Record<string, unknown> = {}
    columns?.forEach((col) => {
        recordData[col.name] = formData.get(col.name)
    })

    const { error } = await supabase
        .from('archive_records')
        .update({ data: recordData })
        .eq('id', recordId)
        .eq('table_id', tableId)

    if (error) {
        console.error('Error updating record:', error)
        return { error: error.message }
    }
    revalidatePath(`/dashboard/tables/${tableId}`)
    revalidatePath(`/dashboard/tables/${tableId}/record/${recordId}`)
    return { success: true }
}

export async function patchRecord(tableId: string, recordId: string, columnName: string, value: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Fetch current data
    const { data: record, error: fetchError } = await supabase
        .from('archive_records')
        .select('data')
        .eq('id', recordId)
        .single()

    if (fetchError || !record) return { error: 'Record not found' }

    const updatedData = { ...record.data, [columnName]: value }

    const { error } = await supabase
        .from('archive_records')
        .update({ data: updatedData })
        .eq('id', recordId)

    if (error) {
        console.error('Error patching record:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/tables/${tableId}`)
    return { success: true }
}
