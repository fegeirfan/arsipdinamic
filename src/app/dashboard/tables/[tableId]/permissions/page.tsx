import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  archiveTables,
  users,
  tablePermissions as allPermissions,
} from '@/lib/data';
import { User, UserRole } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

export default function TablePermissionsPage({
  params,
}: {
  params: { tableId: string };
}) {
  const table = archiveTables.find((t) => t.id === params.tableId);
  if (!table) return <div>Table not found</div>;

  const tablePics = table.picIds;
  const tablePerms = allPermissions.filter((p) => p.tableId === table.id);

  // Combine PICs and users with explicit permissions, avoiding duplicates
  const userIdsWithAccess = [
    ...new Set([...tablePics, ...tablePerms.map((p) => p.userId)]),
  ];
  const relevantUsers = users.filter((u) => userIdsWithAccess.includes(u.id) || u.role === 'admin');

  const getPermissions = (userId: string, role: UserRole) => {
    if (role === 'admin') {
      return { isPic: true, canView: true, canInsert: true, canEdit: true, canDelete: true, canEditStructure: true, disabled: true };
    }
    const isPic = tablePics.includes(userId);
    if (isPic) {
      return { isPic: true, canView: true, canInsert: true, canEdit: true, canDelete: true, canEditStructure: true, disabled: false };
    }
    const explicitPerms = tablePerms.find((p) => p.userId === userId);
    return {
      isPic: false,
      canView: !!explicitPerms?.canView,
      canInsert: !!explicitPerms?.canInsert,
      canEdit: !!explicitPerms?.canEdit,
      canDelete: !!explicitPerms?.canDelete,
      canEditStructure: !!explicitPerms?.canEditStructure,
      disabled: false,
    };
  };

  const permissionLabels = ['PIC', 'View', 'Insert', 'Edit', 'Delete', 'Structure'];
  type PermissionKey = 'isPic' | 'canView' | 'canInsert' | 'canEdit' | 'canDelete' | 'canEditStructure';


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Table Permissions</CardTitle>
                <CardDescription>
                Manage who can access and modify this table. Admins have full access by default.
                </CardDescription>
            </div>
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              {permissionLabels.map((label) => (
                <TableHead key={label} className="text-center">{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantUsers.map((user) => {
              const perms = getPermissions(user.id, user.role);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  {Object.keys(perms).filter(key => key !== 'disabled').map((key) => (
                    <TableCell key={key} className="text-center">
                        <Checkbox defaultChecked={perms[key as PermissionKey]} disabled={perms.disabled} />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
        <div className="flex-1" />
        <Button>Save Permissions</Button>
      </CardFooter>
    </Card>
  );
}
