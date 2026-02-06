import type React from 'react';
import { AppSidebar } from './components/sidebar';
import { AppHeader } from './components/header';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'staff';
  const { data: picTeams } = await supabase.from('teams').select('id').eq('pic_id', user.id);
  const isPic = (picTeams?.length ?? 0) > 0;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar role={role} isPic={isPic} />
      <div className="flex flex-col">
        <AppHeader role={role} isPic={isPic} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
