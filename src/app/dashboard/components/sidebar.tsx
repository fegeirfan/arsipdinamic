import { AppSidebarNav } from './sidebar-nav';

export function AppSidebar({ role, isPic = false }: { role: string; isPic?: boolean }) {
  return (
    <div className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <AppSidebarNav role={role} isPic={isPic} />
      </div>
    </div>
  );
}
