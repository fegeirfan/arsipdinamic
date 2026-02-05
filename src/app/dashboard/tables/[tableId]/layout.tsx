'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Database, Settings2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { archiveTables } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function TableDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tableId: string };
}) {
  const pathname = usePathname();
  const table = archiveTables.find((t) => t.id === params.tableId);

  const navItems = [
    {
      href: `/dashboard/tables/${params.tableId}`,
      label: 'Data',
      icon: Database,
    },
    {
      href: `/dashboard/tables/${params.tableId}/builder`,
      label: 'Builder',
      icon: Settings2,
    },
    {
      href: `/dashboard/tables/${params.tableId}/permissions`,
      label: 'Permissions',
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/tables">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {table?.name || 'Table'}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {/* Action buttons can go here */}
        </div>
      </div>
      <nav className="border-b">
        <div className="flex items-center gap-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-1 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
              pathname === item.href && 'text-primary border-b-2 border-primary'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
