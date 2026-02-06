import { GanttChartSquare } from 'lucide-react';
import { login } from '@/app/auth/actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './submit-button';

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-sidebar lg:flex flex-col items-center justify-center p-8 text-sidebar-foreground">
        <div className="flex items-center gap-4 text-4xl font-bold">
          <GanttChartSquare className="h-12 w-12" />
          <h1 className="font-headline">POLARIX</h1>
        </div>
        <p className="mt-4 text-lg text-sidebar-foreground/80">Arsip Digital Tanpa Batas Struktur</p>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Login</h1>
            <p className="text-balance text-muted-foreground">
              Masukkan email Anda untuk masuk ke sistem
            </p>
          </div>
          <form className="grid gap-4" action={login}>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
