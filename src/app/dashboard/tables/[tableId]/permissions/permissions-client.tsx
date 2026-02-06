'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { saveTablePermissions, type PermissionRow } from './actions'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type PermRow = {
  userId: string
  fullName: string
  email: string | null
  role: string
  avatarUrl: string | null
  isPic: boolean
  canView: boolean
  canInsert: boolean
  canEdit: boolean
  canDelete: boolean
  canEditStructure: boolean
  disabled: boolean
}

export function PermissionsClient({
  tableId,
  tableName,
  initialPermissions,
  canEditStructure,
}: {
  tableId: string
  tableName: string
  initialPermissions: PermRow[]
  canEditStructure: boolean
}) {
  const [rows, setRows] = useState<PermRow[]>(initialPermissions)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const toggle = (userId: string, key: keyof PermRow, value: boolean) => {
    if (key === 'userId' || key === 'fullName' || key === 'email' || key === 'role' || key === 'avatarUrl' || key === 'isPic' || key === 'disabled') return
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, [key]: value } : r))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: PermissionRow[] = rows.map((r) => ({
      userId: r.userId,
      canView: r.canView,
      canInsert: r.canInsert,
      canEdit: r.canEdit,
      canDelete: r.canDelete,
      canEditStructure: r.canEditStructure,
    }))
    const result = await saveTablePermissions(tableId, payload)
    setSaving(false)
    if (result?.error) {
      toast({ title: 'Gagal menyimpan', description: result.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Izin disimpan', description: 'Perubahan izin tabel telah disimpan.' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/tables/${tableId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Izin Tabel: {tableName}</h1>
          <p className="text-sm text-muted-foreground">
            Atur siapa yang boleh melihat, menambah, mengedit, atau menghapus isi arsip. Edit struktur hanya untuk Admin/PIC.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Matrix Izin</CardTitle>
          <CardDescription>
            Centang izin per user. Staf hanya dapat mengedit isi data jika diberi izin Edit oleh PIC/Admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-center w-16">PIC</TableHead>
                  <TableHead className="text-center w-20">View</TableHead>
                  <TableHead className="text-center w-20">Insert</TableHead>
                  <TableHead className="text-center w-20">Edit</TableHead>
                  <TableHead className="text-center w-20">Delete</TableHead>
                  {canEditStructure && (
                    <TableHead className="text-center w-24">Struktur</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={r.avatarUrl ?? undefined} />
                          <AvatarFallback>{(r.fullName || r.email || '?').slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{r.fullName}</div>
                          <div className="text-xs text-muted-foreground">{r.email ?? r.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.isPic} disabled />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={r.canView}
                        disabled={r.disabled}
                        onCheckedChange={(v) => toggle(r.userId, 'canView', v === true)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={r.canInsert}
                        disabled={r.disabled}
                        onCheckedChange={(v) => toggle(r.userId, 'canInsert', v === true)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={r.canEdit}
                        disabled={r.disabled}
                        onCheckedChange={(v) => toggle(r.userId, 'canEdit', v === true)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={r.canDelete}
                        disabled={r.disabled}
                        onCheckedChange={(v) => toggle(r.userId, 'canDelete', v === true)}
                      />
                    </TableCell>
                    {canEditStructure && (
                      <TableCell className="text-center">
                        <Checkbox
                          checked={r.canEditStructure}
                          disabled={r.disabled}
                          onCheckedChange={(v) => toggle(r.userId, 'canEditStructure', v === true)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Izin'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
