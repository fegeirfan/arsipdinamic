import Link from 'next/link';
import { Menu } from 'lucide-react';
import { UserNav } from './user-nav';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AppSidebarNav } from './sidebar-nav';

export function AppHeader({ role, isPic = false }: { role: string; isPic?: boolean }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border p-0">
          <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
          <AppSidebarNav isMobile={true} role={role} isPic={isPic} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1" />
      <UserNav />
    </header>
  );
}
