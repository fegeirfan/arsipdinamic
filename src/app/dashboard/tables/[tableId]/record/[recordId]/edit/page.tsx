import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { updateRecord } from '../../../actions'

export default async function EditRecordPage(props: {
  params: Promise<{ tableId: string; recordId: string }>
}) {
  const { tableId, recordId } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: record } = await supabase
    .from('archive_records')
    .select('*')
    .eq('id', recordId)
    .eq('table_id', tableId)
    .single()

  const { data: table } = await supabase
    .from('archive_tables')
    .select('name')
    .eq('id', tableId)
    .single()

  const { data: columns } = await supabase
    .from('archive_columns')
    .select('*')
    .eq('table_id', tableId)
    .order('order_index')

  if (!record || !table) notFound()

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { data: myPermission } = await supabase
    .from('table_permissions')
    .select('can_edit')
    .eq('table_id', tableId)
    .eq('user_id', user.id)
    .single()
  const { data: tableWithTeam } = await supabase
    .from('archive_tables')
    .select('team_pic_id, created_by, team:teams(pic_id)')
    .eq('id', tableId)
    .single()
  const isPic =
    tableWithTeam?.team_pic_id === user.id ||
    tableWithTeam?.created_by === user.id ||
    (tableWithTeam?.team as { pic_id?: string } | null)?.pic_id === user.id
  const canEdit = profile?.role === 'admin' || isPic || myPermission?.can_edit === true
  if (!canEdit) redirect(`/dashboard/tables/${tableId}/record/${recordId}`)

  const updateRecordWithIds = updateRecord.bind(null, tableId, recordId)

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/tables/${tableId}/record/${recordId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Arsip: {table.name}</h1>
      </div>

      <Card className="border-sidebar-accent/10">
        <CardHeader>
          <CardTitle>Data Arsip</CardTitle>
          <CardDescription>Ubah isi arsip. Kolom struktur tidak dapat diubah dari sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={updateRecordWithIds}>
            <div className="grid gap-4">
              {columns?.map((col) => {
                const val = record.data?.[col.name] ?? record.data?.[col.id]
                const defaultValue = val != null ? String(val) : ''
                return (
                  <div key={col.id} className="grid gap-2">
                    <Label htmlFor={col.id} className="font-semibold">
                      {col.name} {col.is_required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={col.id}
                      name={col.name}
                      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                      required={col.is_required}
                      defaultValue={defaultValue}
                      className="border-sidebar-accent/10 focus:border-sidebar-accent"
                    />
                  </div>
                )
              })}
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" asChild className="border-sidebar-accent/20">
                <Link href={`/dashboard/tables/${tableId}/record/${recordId}`}>Batal</Link>
              </Button>
              <Button type="submit" className="bg-sidebar-accent hover:bg-sidebar-accent/90">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
