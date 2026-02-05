'use client';
import Link from 'next/link';
import { GanttChartSquare, Home, Table, Users, Settings, Download } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/tables', icon: Table, label: 'Tables' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/backup', icon: Download, label: 'Backup & Export' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

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
