import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, DatabaseZap, Users, GanttChartSquare } from 'lucide-react';

const featureCards = [
  {
    icon: <DatabaseZap className="h-10 w-10 text-accent" />,
    title: 'Dynamic Tables',
    description: 'Buat dan kelola struktur tabel data Anda secara langsung, tanpa perlu migrasi database yang rumit.',
  },
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: 'Role & Permission',
    description: 'Kontrol penuh atas siapa yang dapat melihat dan mengubah data dengan sistem peran dan izin yang granular.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent" />,
    title: 'Public & Private Archive',
    description: 'Tentukan visibilitas setiap tabel, pisahkan data publik dengan data sensitif yang hanya bisa diakses oleh pihak berwenang.',
  },
  {
    icon: <Zap className="h-10 w-10 text-accent" />,
    title: 'Secure & Scalable',
    description: 'Dibangun di atas infrastruktur yang aman dan dapat diskalakan, siap untuk bertumbuh bersama kebutuhan Anda.',
  }
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="font-bold">POLARIX</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="#fitur">Fitur</Link>
            </Button>
            <Button asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div
            aria-hidden="true"
            className="absolute inset-0 top-0 -z-10 h-full w-full bg-background"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0, hsl(var(--primary)/0.1), transparent 60%)',
            }}
          />
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Arsip Digital Tanpa Batas Struktur
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Kelola arsip secara fleksibel, dinamis, dan terkontrol tanpa perlu coding. POLARIX memberikan Anda kekuatan untuk mendefinisikan data Anda sendiri.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/login">Masuk ke Sistem</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 <Link href="#fitur">Lihat Fitur</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section id="fitur" className="w-full bg-muted py-20 lg:py-28">
          <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2 font-headline text-xl">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Role Explanation */}
        <section className="w-full py-20 lg:py-28">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Didesain untuk Setiap Peran</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Baik Anda seorang administrator sistem atau staf, POLARIX menyediakan alat yang tepat untuk Anda.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="bg-card p-8">
                         <h3 className="font-headline text-2xl font-bold mb-4">Untuk Administrator</h3>
                         <p className="text-muted-foreground mb-4">
                             Dapatkan kontrol penuh atas seluruh sistem. Buat tabel, tentukan struktur, kelola pengguna, dan atur izin akses dengan mudah melalui dashboard admin yang intuitif.
                         </p>
                         <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 text-primary mt-1"/><span>Manajemen User & Role</span></li>
                            <li className="flex items-start gap-2"><DatabaseZap className="h-5 w-5 text-primary mt-1"/><span>Kontrol Penuh Atas Struktur Data</span></li>
                            <li className="flex items-start gap-2"><Users className="h-5 w-5 text-primary mt-1"/><span>Pengaturan Izin Akses Granular</span></li>
                         </ul>
                     </Card>
                     <Card className="bg-card p-8">
                         <h3 className="font-headline text-2xl font-bold mb-4">Untuk Staf & PIC</h3>
                         <p className="text-muted-foreground mb-4">
                            Fokus pada tugas utama Anda: mengelola dan mengarsipkan data. Isi dan perbarui catatan pada tabel yang menjadi tanggung jawab Anda dengan antarmuka yang sederhana dan efisien.
                         </p>
                         <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2"><GanttChartSquare className="h-5 w-5 text-primary mt-1"/><span>Akses Terfokus pada Tabel Relevan</span></li>
                            <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-primary mt-1"/><span>Input dan Manajemen Data yang Cepat</span></li>
                            <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 text-primary mt-1"/><span>Bekerja Sesuai Hak Akses yang Diberikan</span></li>
                         </ul>
                     </Card>
                </div>
            </div>
        </section>


        {/* Call to Action */}
        <section className="w-full bg-primary text-primary-foreground py-20">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Siap Mengorganisir Arsip Anda?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Mulailah mengelola arsip digital Anda dengan cara yang lebih cerdas dan fleksibel.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/login">Login dan Mulai Sekarang</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
             <Link href="/" className="flex items-center gap-2 font-headline text-lg">
                <GanttChartSquare className="h-6 w-6 text-primary" />
                <span className="font-bold">POLARIX</span>
            </Link>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Dibangun dengan Next.js dan Firebase Studio.
            </p>
          </div>
           <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} POLARIX. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
