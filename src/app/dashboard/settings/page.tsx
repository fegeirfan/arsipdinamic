import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Manage your system-wide settings here.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="appName">Application Name</Label>
            <Input id="appName" defaultValue="POLARIX" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@polarix.com" />
          </div>
        </CardContent>
        <CardFooter className='border-t px-6 py-4'>
            <div className='flex-1' />
            <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </>
  );
}
