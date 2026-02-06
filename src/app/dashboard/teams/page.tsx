import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TeamsClient } from './teams-client'

export default async function TeamsPage() {
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

    // Fetch teams with their PIC details
    const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select(`
            *,
            pic:profiles!teams_pic_id_fkey(id, full_name, email, avatar_url)
        `)
        .order('name')

    if (teamsError) {
        console.error('Error fetching teams:', teamsError)
    }

    // Fetch all profiles for the create dialog and member management
    const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, team_id')

    return <TeamsClient initialTeams={teams || []} initialUsers={users || []} />
}
