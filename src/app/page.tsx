"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  ShieldCheck,
  DatabaseZap,
  Users,
  GanttChartSquare,
  ArrowRight,
  UserCheck,
  Lock,
  CheckCircle2,
  Layers,
  LayoutDashboard,
  MousePointerClick
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <DatabaseZap className="h-6 w-6" />,
    title: 'Dynamic Builder',
    description: 'Ubah struktur data kapan saja tanpa coding. Tambah kolom baru dalam hitungan detik.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure Access',
    description: 'Sistem permission bertingkat memastikan data hanya dilihat oleh yang berhak.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Delegasikan tugas dengan sistem PIC untuk setiap tabel arsip.',
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Flexible Types',
    description: 'Dukung berbagai tipe data: teks, tanggal, file, angka, dan banyak lagi.',
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-abstract');
  const solutionImage = PlaceHolderImages.find(p => p.id === 'solution-visual');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-md">
              <GanttChartSquare className="h-5 w-5" />
            </div>
            <span className="font-headline text-lg font-bold tracking-tight">POLARIX</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#fitur" className="hover:text-primary transition-colors">Fitur</Link>
              <Link href="#workflow" className="hover:text-primary transition-colors">Workflow</Link>
            </nav>
            <div className="h-6 w-px bg-border/50 hidden md:block"></div>
            <Button size="sm" asChild className="font-semibold shadow-lg shadow-primary/20 rounded-full px-6">
              <Link href="/auth/login">Masuk System</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-70"></div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 lg:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Hero Text */}
              <div className="flex flex-col space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-muted-foreground w-fit mx-auto lg:mx-0 shadow-sm">
                  <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  Platform Arsip Digital No-Code
                </div>

                <h1 className="font-headline text-[2.75rem] leading-[1.1] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                  Atur Data Arsip <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Tanpa Koding</span>
                </h1>

                <p className="max-w-[42rem] mx-auto lg:mx-0 leading-normal text-muted-foreground sm:text-lg sm:leading-8">
                  Polarix memberikan kebebasan penuh untuk mendesain, mengelola, dan mengamankan arsip digital organisasi Anda. Struktur dinamis yang mengikuti kebutuhan Anda, bukan sebaliknya.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button size="lg" className="h-12 px-8 rounded-full text-base w-full sm:w-auto shadow-xl shadow-primary/25" asChild>
                    <Link href="/auth/login">
                      Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base w-full sm:w-auto bg-background/50 border-primary/20 hover:bg-muted" asChild>
                    <Link href="#workflow">Pelajari Workflow</Link>
                  </Button>
                </div>

                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Unlimited Tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Role-based Access</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative order-1 lg:order-2 mx-auto lg:mx-0 w-full max-w-[500px] lg:max-w-none">
                <div className="relative rounded-2xl border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-square lg:aspect-[4/3] group">
                  <div className="absolute top-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 z-10 pointer-events-none"></div>

                  {/* Decorative UI Elements */}
                  <div className="absolute top-4 left-4 right-4 h-8 bg-muted/40 rounded-lg flex items-center px-3 gap-2 z-20 border border-white/5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></div>
                  </div>

                  {heroImage ? (
                    <Image
                      src={heroImage.imageUrl}
                      alt="Platform Preview"
                      fill
                      className="object-cover mt-8 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20">
                      Feature Visualization
                    </div>
                  )}
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 z-30 bg-card border shadow-xl p-4 rounded-xl hidden md:flex items-center gap-3 animate-bounce-slow">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Status Keamanan</p>
                    <p className="font-bold text-sm">Data Terproteksi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid - Bento Style */}
        <section id="fitur" className="w-full py-20 bg-muted/20 border-y border-border/50">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Platform Pintar untuk Data Anda</h2>
              <p className="mt-4 text-muted-foreground">
                Kami menyediakan tools esensial agar Anda bisa fokus pada pengelolaan isi arsip, bukan teknis sistemnya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-headline font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section - ZigZag */}
        <section id="workflow" className="w-full py-24 overflow-hidden">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto space-y-24">

            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center relative overflow-hidden group">
                  <LayoutDashboard className="h-24 w-24 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-x-8 bottom-0 h-1/2 bg-background rounded-t-xl border-x border-t shadow-lg opacity-80 translate-y-4 group-hover:translate-y-2 transition-transform"></div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                <h3 className="font-headline text-3xl font-bold">Buat Tabel Tanpa Batas</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mulai dengan kanvas kosong. Berikan nama, deskripsi, dan kategori. Kumpulkan arsip Surat, Dokumen Proyek, atau Data Karyawan dalam wadah terpisah yang rapi.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-1 space-y-6 md:text-right">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold md:ml-auto">2</div>
                <h3 className="font-headline text-3xl font-bold">Desain Struktur Data</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tentukan kolom apa saja yang Anda butuhkan. Drag & drop kolom Teks, Tanggal, Angka, atau File Upload. Ubah struktur kapanpun kebutuhan bisnis berkembang.
                </p>
              </div>
              <div className="order-2 relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-bl from-accent/10 to-accent/5 border border-accent/10 flex items-center justify-center relative overflow-hidden group">
                  <MousePointerClick className="h-24 w-24 text-accent/40 group-hover:scale-110 transition-transform duration-500" />
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-y-4 left-0 w-1/2 bg-background rounded-r-xl border-y border-r shadow-lg opacity-60 -translate-x-4 group-hover:translate-x-0 transition-transform"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-tr from-purple-500/10 to-purple-500/5 border border-purple-500/10 flex items-center justify-center relative overflow-hidden group">
                  <UserCheck className="h-24 w-24 text-purple-500/40 group-hover:scale-110 transition-transform duration-500" />
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-4 bg-background rounded-xl border shadow-sm flex items-center justify-center opacity-80">
                    <div className="h-2 w-24 bg-purple-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold dark:bg-purple-900/30 dark:text-purple-400">3</div>
                <h3 className="font-headline text-3xl font-bold">Kontrol & Delegasi</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tunjuk PIC (Person In Charge) untuk setiap tabel. Admin memegang kendali penuh, staf fokus bekerja, dan data tetap aman dengan batasan akses yang jelas.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center relative z-10">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6">Siap Merapikan Arsip Anda?</h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 text-lg mb-10">
              Bergabunglah sekarang dan rasakan kemudahan mengelola ribuan data tanpa sakit kepala teknis.
            </p>
            <Button size="lg" variant="secondary" className="h-12 px-10 text-lg rounded-full shadow-2xl hover:scale-105 transition-transform" asChild>
              <Link href="/auth/login">Masuk ke Dashboard</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-background py-12">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">POLARIX</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Polarix System. Built for Flexibility.
          </p>
        </div>
      </footer>
    </div>
  );
}
