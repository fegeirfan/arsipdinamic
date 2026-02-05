import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { archiveColumns, archiveTables } from '@/lib/data';
import { Trash2, PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function TableBuilderPage({
  params,
}: {
  params: { tableId: string };
}) {
  const table = archiveTables.find((t) => t.id === params.tableId);
  const columns = archiveColumns.filter((c) => c.tableId === params.tableId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Builder</CardTitle>
        <CardDescription>
          Define the structure of your table. Add, edit, or remove columns as
          needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((col) => (
              <TableRow key={col.id}>
                <TableCell className="font-medium">
                  <Input type="text" defaultValue={col.name} />
                </TableCell>
                <TableCell>
                  <Select defaultValue={col.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {col.type === 'select' ? (
                     <Textarea defaultValue={col.options?.join(', ')} placeholder="Option1, Option2" className="h-10"/>
                  ) : (
                    <Input type="text" disabled placeholder="N/A" />
                  )}
                </TableCell>
                <TableCell>
                  <Switch defaultChecked={col.isRequired} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" className="mt-4 w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Column
        </Button>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex-1" />
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
