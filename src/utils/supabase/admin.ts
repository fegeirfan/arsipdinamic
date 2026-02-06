'use server'

import { createServerClient } from '@supabase/ssr'

/**
 * Creates a Supabase admin client using the service role key.
 * This should only be used in server-side contexts where the service role key
 * is properly secured and never exposed to the client.
 * 
 * IMPORTANT: The service role key bypasses RLS policies.
 * Only use this for admin operations like creating users.
 */
export async function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
        throw new Error(
            'Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
        )
    }

    return createServerClient(url, serviceRoleKey, {
        cookies: {
            getAll() {
                return []
            },
            setAll() {
                // No cookies to set for admin client
            },
        },
    })
}
