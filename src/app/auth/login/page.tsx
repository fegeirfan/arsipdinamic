import Link from 'next/link';
import { GanttChartSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/dashboard">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
