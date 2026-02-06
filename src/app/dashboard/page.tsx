import { createClient } from '@/utils/supabase/server';
import { AdminDashboard } from './components/admin-dashboard';
import { UserDashboard } from './components/user-dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'staff';

  return role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}
