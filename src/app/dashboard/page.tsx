import Link from 'next/link';
import {
  ArrowUpRight,
  File,
  Table,
  Users,
  Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { archiveTables, users } from '@/lib/data';
import { format } from 'date-fns';

export default function Dashboard() {
  const getPic = (picId: string) => users.find(u => u.id === picId);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tables
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Records
            </CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              +18.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +1 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Stored</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Total storage used: 1.2 MB
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
      <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Tables</CardTitle>
              <CardDescription>
                Recently created or modified archive tables.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/tables">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ShadcnTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Visibility
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    PIC
                  </TableHead>
                  <TableHead className="text-right">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archiveTables.slice(0, 3).map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>
                      <div className="font-medium">{table.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {table.description.substring(0,30)}...
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant={table.visibility === 'public' ? 'secondary' : 'destructive'}>
                        {table.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPic(table.picIds[0])?.name}
                    </TableCell>
                    <TableCell className="text-right">
                       {format(new Date(table.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ShadcnTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
