import Link from 'next/link';
import {
  File,
  PlusCircle,
  Lock,
  Globe,
  MoreVertical,
  Users,
  Eye,
  Settings2,
  Trash2,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { archiveTables, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

export default function TablesPage() {

  const getPics = (picIds: string[]) => {
    return picIds.map(id => users.find(u => u.id === id)).filter(Boolean) as (typeof users[0])[];
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Archive Tables</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tables..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/tables/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Table
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {archiveTables.map((table) => {
          const tablePics = getPics(table.picIds);
          return (
            <Card key={table.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href={`/dashboard/tables/${table.id}`} className="cursor-pointer"> <Eye className="mr-2 h-4 w-4"/> View Data</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/dashboard/tables/${table.id}/builder`} className="cursor-pointer"><Settings2 className="mr-2 h-4 w-4"/> Table Builder</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/dashboard/tables/${table.id}/permissions`} className="cursor-pointer"><Users className="mr-2 h-4 w-4"/>Permissions</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"> <Trash2 className="mr-2 h-4 w-4"/> Delete Table</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">{table.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {table.visibility === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {table.visibility}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <File className="h-3 w-3" />5 Records
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <TooltipProvider>
                  {tablePics.map(pic => (
                    <Tooltip key={pic.id}>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 border-card">
                          <AvatarImage src={pic.avatarUrl} data-ai-hint="person portrait" />
                          <AvatarFallback>{pic.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>PIC: {pic.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  </TooltipProvider>
                </div>
                <span className="text-xs text-muted-foreground">Created {format(new Date(table.createdAt), 'MMM d, yyyy')}</span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
