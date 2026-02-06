'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createStaff(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const teamId = formData.get('teamId') as string
    const role = 'staff'

    // 1. Verify the requester is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized: Authentication required')
    }

    // 2. Check if the requester is an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Forbidden: Admin access required')
    }

    // 3. Create the new user using service role
    const adminClient = await createAdminClient()
    const { error } = await adminClient.auth.admin.createUser({
        email,
        password,
        user_metadata: {
            full_name: fullName,
            role,
            team_id: teamId,
        },
        email_confirm: true,
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/users')
    return { success: true }
}
