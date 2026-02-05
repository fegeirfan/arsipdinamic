import { PlusCircle, File, Search, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { archiveColumns, archiveRecords, archiveTables } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TableDataPage({
  params,
}: {
  params: { tableId: string };
}) {
  const table = archiveTables.find((t) => t.id === params.tableId);
  const columns = archiveColumns.filter((c) => c.tableId === params.tableId);
  const records = archiveRecords.filter((r) => r.tableId === params.tableId);

  if (!table) {
    return <div>Table not found.</div>;
  }

  const renderCell = (record: typeof records[0], column: typeof columns[0]) => {
    const value = record.data[column.id];
    switch (column.type) {
      case 'date':
        return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
      case 'file':
        return value ? <Link href={value} className="text-primary underline" target="_blank">{value.split('/').pop()}</Link> : 'No file';
      case 'select':
        return value ? <Badge variant="secondary">{value}</Badge> : 'N/A';
      case 'number':
         return value ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value) : 'N/A';
      default:
        return value || 'N/A';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Record
                </span>
              </Button>
            </div>
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id}>{col.name}</TableHead>
              ))}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                {columns.map((col) => (
                  <TableCell key={`${record.id}-${col.id}`}>
                    {renderCell(record, col)}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" size="icon">
                    ...
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {records.length === 0 && (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                        No records found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
