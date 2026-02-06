import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'

export default async function RecordDetailPage(props: {
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

  const renderValue = (col: { type: string; name: string }, value: unknown) => {
    if (value == null || value === '') return '—'
    switch (col.type) {
      case 'date':
        return format(new Date(String(value)), 'dd MMM yyyy')
      case 'file':
        return (
          <a href={String(value)} className="text-primary underline" target="_blank" rel="noopener noreferrer">
            {String(value).split('/').pop()}
          </a>
        )
      case 'select':
        return <Badge variant="secondary">{String(value)}</Badge>
      case 'number':
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))
      default:
        return String(value)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/tables/${tableId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Detail Arsip: {table.name}</h1>
            <p className="text-sm text-muted-foreground">
              Dibuat {format(new Date(record.created_at), 'dd MMM yyyy HH:mm')} · Oleh {record.created_by_email || 'System'}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/dashboard/tables/${tableId}/record/${recordId}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <Card className="border-sidebar-accent/10">
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            {columns?.map((col) => (
              <div key={col.id} className="flex flex-col gap-1">
                <dt className="text-sm font-medium text-muted-foreground">{col.name}</dt>
                <dd className="text-sm">
                  {renderValue(col, record.data?.[col.name] ?? record.data?.[col.id])}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
