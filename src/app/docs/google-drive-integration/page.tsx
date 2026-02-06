'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Copy, Terminal, Globe, Key, FolderOpen, ArrowRight, FileCode, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const steps = [
  {
    icon: FileCode,
    title: "Buat Project Baru",
    description: "Masuk ke Google Apps Script dan buat project baru"
  },
  {
    icon: Copy,
    title: "Salin Kode Script",
    description: "Tempel kode yang telah disiapkan ke editor"
  },
  {
    icon: Globe,
    title: "Deploy Web App",
    description: "Publish script sebagai web app yang dapat diakses"
  },
  {
    icon: Key,
    title: "Simpan Web App URL",
    description: "Ambil URL dan integrasikan ke aplikasi"
  }
];

const codeSnippet = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    // Masukkan ID Folder spesifik di sini jika diinginkan
    // Contoh: DriveApp.getFolderById("12345abcdef...")
    var folder = DriveApp.getRootFolder(); 
    
    var blob = Utilities.newBlob(Utilities.base64Decode(data.file), data.mimeType, data.filename);
    var file = folder.createFile(blob);
    
    // Set permission agar bisa diakses via link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService.createTextOutput(JSON.stringify({
      url: file.getUrl(),
      status: "success"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function GoogleDriveDocsPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Dokumentasi
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Panduan Integrasi Google Drive
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl">
            Pelajari cara menghubungkan Arsip Dinamis dengan Google Drive Anda menggunakan Google Apps Script untuk upload file otomatis.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-6">
        <div className="bg-card rounded-xl shadow-lg border p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="font-semibold text-sm truncate">{step.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-10">
          
          {/* Step 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-lg">
                1
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Buat Google Apps Script Baru</h2>
                <p className="text-muted-foreground text-sm">Langkah pertama untuk memulai integrasi</p>
              </div>
            </div>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <ol className="list-decimal list-inside space-y-3 sm:space-y-4 text-sm sm:text-base">
                  <li>
                    Buka <a href="https://script.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      script.google.com
                    </a> dan login dengan akun Google Anda.
                  </li>
                  <li>
                    Klik tombol <strong className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">+ New Project</strong> (Proyek Baru).
                  </li>
                  <li>
                    Beri nama proyek, misalnya <code className="bg-muted px-2 py-0.5 rounded text-sm">Arsip Dinamis Upload</code>.
                  </li>
                </ol>
                
                <Alert className="mt-6 bg-blue-50 border-blue-200">
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Tips</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Pastikan Anda menggunakan akun Google yang memiliki akses ke Google Drive.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Step 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white font-bold shadow-lg">
                2
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Salin Kode Script</h2>
                <p className="text-muted-foreground text-sm">Tempel kode ke editor Google Apps Script</p>
              </div>
            </div>
            
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Code.gs
                </CardTitle>
                <CardDescription>
                  Hapus semua kode yang ada di file Code.gs, lalu salin dan tempel kode berikut:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative group">
                  <div className="absolute top-3 right-3 z-10">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={copyCode}
                      className="h-8 px-3 bg-background/80 backdrop-blur hover:bg-background transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#27ca40]" />
                      </div>
                      <span className="text-xs text-gray-400 ml-2">Code.gs</span>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-xs sm:text-sm font-mono text-gray-200 leading-relaxed">
                        {codeSnippet}
                      </code>
                    </pre>
                  </div>
                </div>
                
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                  <Terminal className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Informasi</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Script ini akan mengupload file ke <strong>Root Folder</strong> Google Drive Anda secara default. 
                    Anda dapat mengubahnya dengan menambahkan ID folder spesifik.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Step 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white font-bold shadow-lg">
                3
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Deploy sebagai Web App</h2>
                <p className="text-muted-foreground text-sm">Publish script agar dapat diakses publik</p>
              </div>
            </div>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <ol className="list-decimal list-inside space-y-4 sm:space-y-5 text-sm sm:text-base">
                  <li>
                    Klik tombol <strong className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Deploy</strong> {'>'} 
                    <strong className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-1">New deployment</strong>
                  </li>
                  <li>
                    Pilih tipe: <strong>Web app</strong> (klik ikon roda gigi di kiri untuk melihat opsi).
                  </li>
                  <li>
                    <span className="font-semibold">Isi konfigurasi berikut:</span>
                    <ul className="list-none ml-0 sm:ml-6 mt-3 space-y-2 sm:space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-0.5">•</span>
                        <div>
                          <strong>Description:</strong> <span className="text-muted-foreground">(Bebas, contoh: Arsip Dinamis v1)</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-0.5">•</span>
                        <div>
                          <strong>Execute as:</strong> <code className="bg-muted px-2 py-0.5 rounded text-sm">Me (your_email@gmail.com)</code>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <div>
                          <strong>Who has access:</strong> <code className="bg-muted px-2 py-0.5 rounded text-sm">Anyone</code>
                          <span className="text-red-500 font-bold ml-2">*WAJIB</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Klik <strong className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Deploy</strong>.
                  </li>
                  <li>
                    Izinkan akses ketika diminta. Ikuti langkah: <span className="text-muted-foreground">Pilih akun Google {'>'} Advanced {'>'} Go to Project (Unsafe) {'>'} Allow</span>
                  </li>
                </ol>
                
                <Alert variant="destructive" className="mt-6 bg-red-50 border-red-200">
                  <AlertTitle className="text-red-800 font-bold">⚠️ Penting!</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Pastikan <strong>Who has access</strong>设置为 <code className="bg-red-100 px-2 py-0.5 rounded">Anyone</code>, 
                    jika tidak aplikasi tidak akan dapat mengakses endpoint ini.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Step 4 - Success */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold shadow-lg">
                4
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Simpan URL Web App</h2>
                <p className="text-muted-foreground text-sm">Ambil URL dan gunakan di aplikasi</p>
              </div>
            </div>
            
            <Card className="border-green-500 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-6 w-6" />
                  Deployment Berhasil!
                </CardTitle>
                <CardDescription>
                  Setelah deployment selesai, Anda akan melihat halaman konfirmasi dengan Web App URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">
                    <strong> Langkah selanjutnya:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                    <li>Salin <strong>Web App URL</strong> yang ditampilkan (Pastikan URL berakhiran <code className="bg-green-200 px-1 rounded">/exec</code>)</li>
                    <li>Tempel URL tersebut ke kolom konfigurasi saat membuat kolom tipe <strong>Google Drive</strong> di aplikasi</li>
                    <li>Selesai! File akan otomatis terupload ke Google Drive</li>
                  </ol>
                </div>
                
                <div className="bg-muted rounded-lg p-4 border">
                  <p className="text-sm font-medium mb-2">Contoh URL yang valid:</p>
                  <code className="text-xs sm:text-sm text-muted-foreground block bg-background p-3 rounded border font-mono break-all">
                    https://script.google.com/macros/s/ABC123xyz/dev/exec
                  </code>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Help Section */}
          <section className="mt-12">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h3 className="font-semibold text-lg">Masih membutuhkan bantuan?</h3>
                    <p className="text-muted-foreground text-sm">Hubungi tim support kami untuk panduan lebih lanjut.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" asChild className="flex-1 sm:flex-none">
                      <Link href="/dashboard">Kembali ke Dashboard</Link>
                    </Button>
                    <Button asChild className="flex-1 sm:flex-none">
                      <Link href="/dashboard/my-archives/create">
                        Buat Tabel Arsip <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} POLARIX. Dokumentasi Integrasi Google Drive.</p>
        </div>
      </footer>
    </div>
  );
}
