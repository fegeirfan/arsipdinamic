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

    const { error } = await supabase.from('archive_records').insert({
        table_id: tableId,
        data: recordData,
        created_by: user.id,
        created_by_email: user.email,
    })

    if (error) {
        console.error('Error creating record:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/tables/${tableId}`)
    redirect(`/dashboard/tables/${tableId}`)
}
