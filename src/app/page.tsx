import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, DatabaseZap, Users, GanttChartSquare, ArrowRight, UserCheck, Lock, PlusSquare, Settings2, FileCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featureCards = [
  {
    icon: <DatabaseZap className="h-10 w-10 text-accent" />,
    title: 'Dynamic Table Builder',
    description: 'Buat tabel arsip dari nol. Tambah, ubah, dan atur kolom kapan saja tanpa migrasi atau bantuan teknis.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent" />,
    title: 'Role & Permission Granular',
    description: 'Kontrol penuh siapa yang bisa melihat, menambah, mengubah, atau menghapus data di setiap tabel.',
  },
  {
    icon: <UserCheck className="h-10 w-10 text-accent" />,
    title: 'Penanggung Jawab (PIC)',
    description: 'Tunjuk satu atau lebih staf sebagai PIC untuk mengelola tabel spesifik, mendelegasikan tanggung jawab dengan jelas.',
  },
  {
    icon: <Lock className="h-10 w-10 text-accent" />,
    title: 'Public & Private Archive',
    description: 'Tentukan visibilitas setiap arsip. Pisahkan data publik dari dokumen internal yang bersifat rahasia.',
  }
];

const howItWorksSteps = [
    {
        step: 1,
        icon: PlusSquare,
        title: "Buat Tabel Baru",
        description: "Definisikan nama dan tujuan tabel arsip Anda, misalnya 'Surat Masuk' atau 'Dokumen Proyek'."
    },
    {
        step: 2,
        icon: Settings2,
        title: "Atur Strukturnya",
        description: "Gunakan table builder visual untuk menambahkan kolom yang Anda butuhkan: teks, angka, tanggal, file, dan lainnya."
    },
    {
        step: 3,
        icon: Users,
        title: "Tentukan Hak Akses",
        description: "Atur siapa saja yang boleh mengakses tabel dan apa yang bisa mereka lakukan. Tunjuk PIC untuk pengelolaan."
    },
    {
        step: 4,
        icon: FileCheck,
        title: "Mulai Mengelola Arsip",
        description: "Staf yang ditunjuk dapat langsung mengisi dan mengelola data arsip sesuai dengan struktur yang telah Anda buat."
    }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-abstract');
  const solutionImage = PlaceHolderImages.find(p => p.id === 'solution-visual');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="font-bold">POLARIX</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="#fitur">Fitur</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="#cara-kerja">Cara Kerja</Link>
            </Button>
            <Button asChild>
                <Link href="/auth/login">Masuk</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-28">
          <div className="container grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col items-start text-left">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Arsip Digital Tanpa Batas Struktur
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
                Bebaskan data Anda dari struktur kaku. Dengan POLARIX, Anda bisa membangun, mengubah, dan mengelola arsip digital secara dinamis—tanpa perlu satu baris kode pun.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/login">Masuk ke Sistem <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="#fitur">Lihat Fitur</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={500}
                  className="rounded-xl shadow-2xl ring-1 ring-border"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Problem -> Solution Section */}
        <section className="w-full py-20 lg:py-28 bg-muted">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-tight">Terjebak Aturan Sistem yang Kaku?</h2>
                    <p className="text-muted-foreground text-lg">
                        Sistem arsip konvensional seringkali memaksa Anda mengikuti struktur data yang sudah mati. Butuh kolom baru? Perlu mengubah format? Anda harus menunggu tim IT, memperlambat alur kerja, dan menghambat inovasi. Data Anda seolah terpenjara.
                    </p>
                    <div className="mt-6 rounded-lg border bg-card p-8 shadow-sm">
                         <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">Solusi POLARIX: Kebebasan Terstruktur</h2>
                         <p className="text-muted-foreground text-lg">
                            Kami memberikan kontrol kembali ke tangan Anda. POLARIX memungkinkan Anda, sang pemilik data, untuk mendefinisikan sendiri struktur arsip secara visual. Fleksibel, cepat, dan tetap aman terkendali dengan manajemen hak akses yang detail.
                        </p>
                    </div>
                </div>
                 <div className="flex items-center justify-center">
                    {solutionImage && (
                        <Image
                            src={solutionImage.imageUrl}
                            alt={solutionImage.description}
                            width={600}
                            height={400}
                            className="rounded-xl shadow-2xl ring-1 ring-border"
                            data-ai-hint={solutionImage.imageHint}
                        />
                    )}
                </div>
            </div>
        </section>

        {/* Feature Highlight */}
        <section id="fitur" className="w-full bg-background py-20 lg:py-28">
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Didesain untuk Fleksibilitas Total</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        POLARIX bukan sekadar tempat menyimpan data, tapi sebuah platform untuk membentuknya.
                    </p>
                </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {featureCards.map((feature, index) => (
                  <Card key={index} className="flex flex-col items-center text-center border-transparent shadow-none">
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
            </div>
        </section>
        
        {/* How It Works */}
        <section id="cara-kerja" className="w-full bg-muted py-20 lg:py-28">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Mulai dalam Hitungan Menit</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                       Dari ide menjadi arsip fungsional hanya dalam 4 langkah sederhana.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {howItWorksSteps.map((step) => (
                        <div key={step.step} className="flex flex-col items-center text-center p-6">
                             <div className="flex items-center mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <step.icon className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 font-headline text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                     ))}
                </div>
            </div>
        </section>

        {/* Role Explanation */}
        <section className="w-full py-20 lg:py-28">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Alat yang Tepat untuk Setiap Peran</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        POLARIX memberdayakan administrator dan memudahkan staf dalam satu platform terpadu.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="bg-card p-8 shadow-sm">
                         <h3 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><Users className="h-8 w-8 text-primary"/>Untuk Administrator</h3>
                         <p className="text-muted-foreground mb-4">
                             Anda adalah arsiteknya. Dapatkan kontrol penuh untuk membuat tabel, mendesain struktur, mengelola pengguna, dan mengatur siapa-bisa-apa dengan presisi.
                         </p>
                         <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2"><DatabaseZap className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Desain dan modifikasi struktur tabel secara live.</span></li>
                            <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Atur hak akses view, create, edit, delete per user per tabel.</span></li>
                            <li className="flex items-start gap-2"><UserCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Delegasikan pengelolaan tabel kepada Penanggung Jawab (PIC).</span></li>
                         </ul>
                     </Card>
                     <Card className="bg-card p-8 shadow-sm">
                         <h3 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><GanttChartSquare className="h-8 w-8 text-primary"/>Untuk Staf & PIC</h3>
                         <p className="text-muted-foreground mb-4">
                            Fokus pada tugas utama Anda: mengelola dan mengarsipkan data. Isi dan perbarui catatan pada tabel yang menjadi tanggung jawab Anda dengan antarmuka yang sederhana dan efisien.
                         </p>
                         <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2"><ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Akses terfokus hanya pada tabel yang relevan untuk Anda.</span></li>
                            <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Input, update, dan cari data dengan cepat tanpa distraksi.</span></li>
                            <li className="flex items-start gap-2"><Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><span>Bekerja dengan aman sesuai hak akses yang telah ditetapkan oleh admin.</span></li>
                         </ul>
                     </Card>
                </div>
            </div>
        </section>


        {/* Call to Action */}
        <section className="w-full bg-primary text-primary-foreground py-20">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Wujudkan Sistem Arsip Ideal Anda</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Berhenti berkompromi dengan sistem yang kaku. Mulai bangun fondasi data yang fleksibel bersama POLARIX.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/login">Masuk dan Mulai Sekarang</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
             <Link href="/" className="flex items-center gap-2 font-headline text-lg">
                <GanttChartSquare className="h-6 w-6 text-primary" />
                <span className="font-bold">POLARIX</span>
            </Link>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Arsip Digital Tanpa Batas Struktur.
            </p>
          </div>
           <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} POLARIX. Didesain dan dikembangkan di Firebase Studio.
            </p>
        </div>
      </footer>
    </div>
  );
}
