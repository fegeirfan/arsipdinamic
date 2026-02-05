'use client';
import Link from 'next/link';
import { Archive, Home, Table, Users, Bell, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/tables', icon: Table, label: 'Tables' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
];

export function AppSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isMobile && "gap-6 text-lg")}>
       <Link
        href="/dashboard"
        className="mb-4 flex items-center gap-2 text-lg font-semibold"
      >
        <Archive className="h-6 w-6 text-primary" />
        <span className="font-headline">Arsipku</span>
      </Link>
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary',
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
