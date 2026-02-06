import { createClient } from '@/utils/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusCircle, Eye, Shield } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MyTeamArchivesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch user's team ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('team_id, team:teams(name)')
        .eq('id', user.id)
        .single()

    if (!profile?.team_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
                <div className="bg-amber-100 p-4 rounded-full">
                    <Shield className="h-12 w-12 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold">Belum Ada Tim</h1>
                <p className="text-muted-foreground max-w-md">
                    Anda belum terdaftar dalam tim manapun. Silakan hubungi Administrator untuk penempatan tim agar dapat mengakses arsip.
                </p>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Kembali ke Dashboard</Link>
                </Button>
            </div>
        )
    }

    // Fetch tables for the team
    const { data: tables, error } = await supabase
        .from('archive_tables')
        .select('*')
        .eq('team_id', profile.team_id)
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold md:text-2xl">Arsip Tim Saya</h1>
                    <p className="text-sm text-muted-foreground">Unit: {profile.team?.name}</p>
                </div>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Daftar Tabel Tim</CardTitle>
                    <CardDescription>
                        Tabel-tabel di bawah ini dikelola oleh unit Anda. Anda memiliki akses penuh sesuai izin tim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Tabel</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tables?.map((table) => (
                                <TableRow key={table.id}>
                                    <TableCell className="font-semibold text-sidebar-accent">
                                        {table.name}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-muted-foreground italic text-sm">
                                        {table.description || 'Tidak ada deskripsi.'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-normal border-sidebar-accent/20 bg-sidebar-accent/5 text-sidebar-accent">
                                            🔒 Tim Saya
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" asChild className="h-8 gap-1">
                                                <Link href={`/dashboard/tables/${table.id}`}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Lihat
                                                </Link>
                                            </Button>
                                            <Button size="sm" asChild className="h-8 gap-1 bg-sidebar-accent hover:bg-sidebar-accent/90">
                                                <Link href={`/dashboard/tables/${table.id}/create`}>
                                                    <PlusCircle className="h-3.5 w-3.5" />
                                                    Tambah
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!tables || tables.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        Tim Anda belum memiliki tabel arsip.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
