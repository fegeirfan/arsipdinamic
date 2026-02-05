import type { Metadata } from 'next';
import { Inter, Lexend_Deca as Lexend } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'Arsipku: Dynamic Records',
  description: 'Sistem Informasi Manajemen Arsip Dinamis by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-body antialiased", inter.variable, lexend.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
