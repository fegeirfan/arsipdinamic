import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { UsersClient } from './users-client'

export default async function UsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Fetch profiles with their team details
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
            *,
            team:teams!profiles_team_id_fkey(id, name)
        `)
        .order('full_name')

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
    }

    // Fetch teams for assignment
    const { data: teams } = await supabase.from('teams').select('id, name')

    return <UsersClient initialProfiles={profiles || []} initialTeams={teams || []} />
}
