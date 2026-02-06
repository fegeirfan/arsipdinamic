'use client'

import { useState } from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { CreateStaffDialog } from './create-staff-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AssignTeamDialog } from './assign-team-dialog'
import { EditRoleDialog } from './edit-role-dialog'

interface Profile {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    role: string
    team_id: string | null
    team?: {
        id: string
        name: string
    } | null
}

interface Team {
    id: string
    name: string
}

interface UsersClientProps {
    initialProfiles: Profile[]
    initialTeams: Team[]
}

export function UsersClient({ initialProfiles, initialTeams }: UsersClientProps) {
    const [profiles, setProfiles] = useState(initialProfiles)
    const [teams] = useState(initialTeams)
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
    const [assignTeamOpen, setAssignTeamOpen] = useState(false)
    const [editRoleOpen, setEditRoleOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredProfiles = profiles.filter(
        (p) =>
            p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manajemen User</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari user..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CreateStaffDialog teams={teams} />
                </div>
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Daftar Pengguna</CardTitle>
                    <CardDescription>
                        Kelola akses, role, dan penempatan tim untuk seluruh pengguna sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProfiles.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={p.avatar_url || undefined} alt={p.full_name || 'User'} />
                                                <AvatarFallback>
                                                    {p.full_name?.substring(0, 2).toUpperCase() || '??'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>{p.full_name || 'Tanpa Nama'}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">
                                                    {p.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {p.team ? (
                                            <Badge
                                                variant="outline"
                                                className="font-normal border-sidebar-accent/20 bg-sidebar-accent/5"
                                            >
                                                {p.team.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Belum ada tim</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={p.role === 'admin' ? 'default' : 'secondary'}
                                            className="capitalize"
                                        >
                                            {p.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{p.email}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi User</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(p)
                                                        setAssignTeamOpen(true)
                                                    }}
                                                >
                                                    📋 Assign Team
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(p)
                                                        setEditRoleOpen(true)
                                                    }}
                                                >
                                                    👤 Edit Role
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    ⏸️ Suspend User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProfiles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        {searchQuery
                                            ? 'Tidak ada pengguna yang sesuai dengan pencarian.'
                                            : 'Tidak ada data pengguna.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
                <p className="text-sm text-amber-500 font-medium">⚠️ UX Warning:</p>
                <p className="text-sm text-muted-foreground">
                    Setiap user wajib memiliki tim untuk dapat mengakses atau membuat arsip.
                    User tanpa tim tidak akan melihat data apapun.
                </p>
            </div>

            {/* Assign Team Dialog */}
            {selectedUser && (
                <AssignTeamDialog
                    open={assignTeamOpen}
                    onOpenChange={setAssignTeamOpen}
                    userId={selectedUser.id}
                    userName={selectedUser.full_name || selectedUser.email}
                    currentTeamId={selectedUser.team_id}
                    teams={teams}
                />
            )}

            {/* Edit Role Dialog */}
            {selectedUser && (
                <EditRoleDialog
                    open={editRoleOpen}
                    onOpenChange={setEditRoleOpen}
                    userId={selectedUser.id}
                    userName={selectedUser.full_name || selectedUser.email}
                    currentRole={selectedUser.role}
                />
            )}
        </div>
    )
}
