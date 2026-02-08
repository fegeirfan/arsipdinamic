'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Layers,
  Lock,
  Crown,
  BarChart3,
} from 'lucide-react'
import { AnimatedBackground } from '@/components/animated-background'

const features = [
  {
    icon: Database,
    title: 'Dynamic Schema Builder',
    description: 'Buat dan modifikasi struktur tabel tanpa coding. Tambah kolom baru dalam hitungan detik.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Layer Security',
    description: 'Sistem permission bertingkat dengan kontrol akses granular untuk setiap data.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Assign PIC, delegasikan tugas, dan kelola tim dengan mudah dalam satu platform.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Performa optimal dengan caching cerdas dan optimasi query untuk data besar.',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
  },
]

const workflows = [
  {
    step: '01',
    title: 'Buat Workspace',
    description: 'Mulai dengan membuat tabel baru. Tentukan nama, kategori, dan visibilitas data Anda.',
    imageUrl: 'https://images.pexels.com/photos/15555858/pexels-photo-15555858.jpeg',
    imageAlt: 'Modern office workspace - Walls.io on Pexels',
  },
  {
    step: '02',
    title: 'Kelola Data & Tim',
    description: 'Kolaborasi dengan tim, assign roles, dan kelola permissions dengan mudah.',
    imageUrl: 'https://images.pexels.com/photos/7691730/pexels-photo-7691730.jpeg',
    imageAlt: 'Team collaboration - Yan Krukau on Pexels',
  },
  {
    step: '03',
    title: 'Amankan Arsip',
    description: 'Tentukan siapa yang bisa lihat, edit, atau hapus data. Full control di tangan Anda.',
    imageUrl: 'https://images.unsplash.com/photo-1768839721176-2fa91fdce725?w=800',
    imageAlt: 'Digital security - Sasun Bughdaryan on Unsplash',
  },
]

const stats = [
  { label: 'Unlimited Tables', value: '∞', icon: Database },
  { label: 'Role-Based Access', value: '5+', icon: Crown },
  { label: 'Uptime', value: '99.9%', icon: BarChart3 },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
            : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <img
                  src="/logo.png"
                  alt="POLARIX Logo"
                  className="relative h-10 w-10 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                POLARIX
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#workflow"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                How It Works
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
              >
                <Link href="/auth/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-indigo-700 bg-indigo-50 border-indigo-200"
                >
                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                  No-Code Archive Platform
                </Badge>

                <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900">
                  Kelola Data Arsip{' '}
                  <span className="text-indigo-600">
                    Tanpa Batasan
                  </span>
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed">
                  Platform no-code untuk mendesain, mengelola, dan mengamankan arsip digital organisasi Anda.
                  Struktur dinamis yang mengikuti kebutuhan bisnis.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                    asChild
                  >
                    <Link href="/auth/login">
                      Mulai Gratis <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 border-slate-300 hover:bg-slate-50"
                    asChild
                  >
                    <Link href="#workflow">Lihat Demo</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                          <div className="text-xs text-slate-600">{stat.label}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200">
                  <img
                    src="https://images.pexels.com/photos/139387/pexels-photo-139387.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Dashboard analytics - Negative Space on Pexels"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 left-6 right-6 bg-white border border-slate-200 rounded-xl shadow-lg p-4 hidden lg:block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-500">System Status</div>
                        <div className="font-bold text-emerald-600">All Systems Operational</div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Live</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-3 bg-indigo-50 text-indigo-700 border-indigo-200">
                Powerful Features
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
                Platform Pintar untuk Data Anda
              </h2>
              <p className="text-base text-slate-600">
                Fokus pada pengelolaan data, biarkan platform mengurus teknis yang rumit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={idx}
                    className="border-slate-200 hover:border-indigo-200 transition-all hover:shadow-lg bg-white"
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className={`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-20 bg-white">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 bg-indigo-50 text-indigo-700 border-indigo-200">
                Simple Workflow
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
                Dari Kosong ke Produktif dalam 3 Langkah
              </h2>
            </div>

            <div className="space-y-16">
              {workflows.map((workflow, idx) => {
                const isEven = idx % 2 === 0
                return (
                  <div
                    key={idx}
                    className={`grid lg:grid-cols-2 gap-10 items-center ${!isEven ? 'lg:grid-flow-dense' : ''
                      }`}
                  >
                    <div className={`space-y-4 ${!isEven ? 'lg:col-start-2' : ''}`}>
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg">
                        {workflow.step}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {workflow.title}
                      </h3>
                      <p className="text-base text-slate-600 leading-relaxed">
                        {workflow.description}
                      </p>
                    </div>

                    <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                        <img
                          src={workflow.imageUrl}
                          alt={workflow.imageAlt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

          <div className="container mx-auto px-8 lg:px-16 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Siap Merapikan Arsip Digital Anda?
              </h2>
              <p className="text-lg text-slate-300">
                Bergabunglah dengan organisasi modern yang mengelola ribuan data tanpa sakit kepala teknis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                  asChild
                >
                  <Link href="/auth/login">
                    Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-slate-600 text-white hover:bg-slate-800"
                  asChild
                >
                  <Link href="#features">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="POLARIX Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-base font-bold text-slate-900">
                POLARIX
              </span>
            </div>

            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} POLARIX System. Built for flexibility and scale.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
