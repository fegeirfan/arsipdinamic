'use client'

import { useState } from 'react'
import { Crown, Users, MoreHorizontal } from 'lucide-react'
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
import { CreateTeamDialog } from './create-team-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AssignPicDialog } from './assign-pic-dialog'
import { ManageMembersDialog } from './manage-members-dialog'
import { DeleteTeamDialog } from './delete-team-dialog'

interface Team {
    id: string
    name: string
    description: string | null
    pic_id: string | null
    pic?: {
        id: string
        full_name: string | null
        email: string
        avatar_url: string | null
    } | null
}

interface User {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    team_id: string | null
}

interface TeamsClientProps {
    initialTeams: Team[]
    initialUsers: User[]
}

export function TeamsClient({ initialTeams, initialUsers }: TeamsClientProps) {
    const [teams, setTeams] = useState(initialTeams)
    const [users, setUsers] = useState(initialUsers)
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [assignPicOpen, setAssignPicOpen] = useState(false)
    const [manageMembersOpen, setManageMembersOpen] = useState(false)

    const getMemberCount = (teamId: string) =>
        users.filter((u) => u.team_id === teamId).length

    const currentMembers = selectedTeam
        ? users
              .filter((u) => u.team_id === selectedTeam.id)
              .map((u) => u.id)
        : []

    const handleTeamCreated = (team: { id: string; name: string; description: string | null; pic_id: string | null }) => {
        setTeams((prev) => [...prev, { ...team, pic: null }])
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manajemen Team & PIC</h1>
                <CreateTeamDialog users={users} onTeamCreated={handleTeamCreated} />
            </div>

            <Card className="border-sidebar-accent/10">
                <CardHeader>
                    <CardTitle>Daftar Tim</CardTitle>
                    <CardDescription>
                        Admin menentukan struktur organisasi dan menunjuk PIC untuk setiap tim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team</TableHead>
                                <TableHead>PIC</TableHead>
                                <TableHead className="text-center">Jumlah User</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{team.name}</span>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {team.description || '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {team.pic ? (
                                            <div className="flex items-center gap-2">
                                                <Crown className="h-3.5 w-3.5 text-sidebar-accent" />
                                                <span className="text-sm">
                                                    {team.pic.full_name || team.pic.email}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-destructive border-destructive/20 bg-destructive/5"
                                            >
                                                Belum ada PIC
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="gap-1">
                                            <Users className="h-3 w-3" />
                                            {getMemberCount(team.id)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedTeam(team)
                                                        setAssignPicOpen(true)
                                                    }}
                                                >
                                                    👑 Assign / Ganti PIC
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedTeam(team)
                                                        setManageMembersOpen(true)
                                                    }}
                                                >
                                                    👥 Kelola Anggota
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DeleteTeamDialog
                                                    teamId={team.id}
                                                    teamName={team.name}
                                                    memberCount={getMemberCount(team.id)}
                                                    trigger={
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            🗑️ Hapus Team
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {teams.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        Belum ada tim yang dibuat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-sidebar-accent/5 border border-sidebar-accent/10 rounded-lg p-4">
                <p className="text-sm text-sidebar-accent font-medium">💡 UX Note:</p>
                <p className="text-sm text-muted-foreground">
                    Tim tidak boleh tanpa PIC. PIC berwenang membuat & mengelola tabel untuk tim yang bersangkutan.
                </p>
            </div>

            {/* Assign PIC Dialog */}
            {selectedTeam && (
                <AssignPicDialog
                    open={assignPicOpen}
                    onOpenChange={setAssignPicOpen}
                    teamId={selectedTeam.id}
                    teamName={selectedTeam.name}
                    currentPicId={selectedTeam.pic_id}
                    users={users}
                />
            )}

            {/* Manage Members Dialog */}
            {selectedTeam && (
                <ManageMembersDialog
                    open={manageMembersOpen}
                    onOpenChange={setManageMembersOpen}
                    teamId={selectedTeam.id}
                    teamName={selectedTeam.name}
                    allUsers={users}
                    currentMembers={currentMembers}
                />
            )}
        </div>
    )
}
