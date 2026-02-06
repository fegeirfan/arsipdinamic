'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArchiveTable(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const teamId = formData.get('teamId') as string
    const picId = formData.get('picId') as string
    const visibility = formData.get('visibility') as string

    const { data, error } = await supabase
        .from('archive_tables')
        .insert({
            name,
            description,
            team_id: teamId,
            team_pic_id: picId,
            visibility,
        })
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
