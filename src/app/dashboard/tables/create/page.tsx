import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateTablePage() {
  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/tables">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create New Archive Table
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Table Details</CardTitle>
          <CardDescription>
            Fill in the details for your new archive table. You can define columns later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Table Name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                placeholder="e.g., Surat Keluar"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A short description of what this table is for."
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="visibility">Visibility</Label>
              <Select defaultValue="public">
                <SelectTrigger id="visibility" aria-label="Select visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="flex items-center justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/tables">Cancel</Link>
                </Button>
                <Button asChild>
                    <Link href="/dashboard/tables/tbl-1/builder">Save and Build Table</Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
