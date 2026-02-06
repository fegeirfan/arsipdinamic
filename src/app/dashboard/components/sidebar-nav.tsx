'use client';
import Link from 'next/link';
import { GanttChartSquare, Home, Table, Users, Settings, Download, Star, Clock, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/teams', icon: Users, label: 'Team & PIC' },
  { href: '/dashboard/tables', icon: Table, label: 'Tabel Arsip' },
  { href: '/dashboard/access', icon: Star, label: 'Akses & Permintaan' },
  { href: '/dashboard/users', icon: UserIcon, label: 'User' },
  { href: '/dashboard/audit', icon: Clock, label: 'Audit Log' },
  { href: '/dashboard/settings', icon: Settings, label: 'Pengaturan Sistem' },
];

const userNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/my-team', icon: Table, label: 'Arsip Tim Saya' },
  { href: '/dashboard/browse', icon: Star, label: 'Jelajahi Tabel' },
  { href: '/dashboard/favorites', icon: Star, label: 'Favorit' },
  { href: '/dashboard/activity', icon: Clock, label: 'Aktivitas Saya' },
  { href: '/dashboard/profile', icon: UserIcon, label: 'Profil' },
];

export function AppSidebarNav({ isMobile = false, role }: { isMobile?: boolean; role: string }) {
  const pathname = usePathname();
  const navItems = role === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isMobile && "gap-6 text-lg")}>
      <Link
        href="/dashboard"
        className="my-4 flex items-center gap-2 text-lg font-semibold"
      >
        <GanttChartSquare className="h-6 w-6 text-sidebar-accent" />
        <span className="font-headline">POLARIX</span>
      </Link>
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-foreground hover:bg-sidebar-accent/10',
              isActive && 'bg-sidebar-accent/20 text-sidebar-foreground',
              isMobile && "text-2xl"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
