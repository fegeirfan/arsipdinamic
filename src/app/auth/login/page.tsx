import { GanttChartSquare, ArrowLeft } from 'lucide-react';
import { login } from '@/app/auth/actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './submit-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-background">
      {/* Visual Sidebar */}
      <div className="hidden lg:relative lg:flex flex-col items-center justify-center p-12 bg-sidebar text-sidebar-foreground overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 max-w-lg text-center">
          <div className="flex items-center gap-4 text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/30">
              <GanttChartSquare className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight">POLARIX</h1>
            <p className="text-xl text-sidebar-foreground/80 leading-relaxed font-light">
              Arsip Digital Tanpa Batas Struktur
            </p>
          </div>

          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-sm italic text-sidebar-foreground/70">
            "Kebebasan mengatur data arsip kini ada di tangan Anda, tanpa ketergantungan pada tim teknis."
          </div>
        </div>

        <div className="absolute bottom-8 text-xs text-sidebar-foreground/40 font-light">
          © {new Date().getFullYear()} POLARIX System
        </div>
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center py-12 px-6 lg:px-20 relative">
        <Button variant="ghost" className="absolute top-8 left-8 sm:left-12 gap-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Landing
          </Link>
        </Button>

        <div className="mx-auto grid w-full max-w-[400px] gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="lg:hidden flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-white mb-4">
              <GanttChartSquare className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Selamat Datang</h1>
            <p className="text-balance text-muted-foreground">
              Masuk untuk mengakses dashboard arsip Anda
            </p>
          </div>

          <div className="bg-card border border-border/50 shadow-lg rounded-xl p-8">
            <form className="grid gap-6" action={login}>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <span className="font-semibold">Error:</span> {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  required
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary underline-offset-4 hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-11"
                />
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun? <Link href="#" className="text-primary hover:underline underline-offset-4">Hubungi Admin</Link> untuk akses.
          </div>
        </div>
      </div>
    </div>
  );
}
