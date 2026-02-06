import { createClient } from '@/utils/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const name = profile?.full_name || user.email?.split('@')[0] || 'User';
    const email = user.email;
    const role = profile?.role || 'staff';
    const avatarUrl = profile?.avatar_url;

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader className="items-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback className="text-2xl">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4">{name}</CardTitle>
                        <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                            {role.toUpperCase()}
                        </Badge>
                    </CardHeader>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Informasi Akun</CardTitle>
                        <CardDescription>Detail informasi profil dan kredensial Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3">
                            <span className="text-muted-foreground font-medium">Email</span>
                            <span className="col-span-2">{email}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3">
                            <span className="text-muted-foreground font-medium">Role</span>
                            <span className="col-span-2">
                                {role === 'admin' ? 'Administrator' : 'Staf Operasional'}
                            </span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3">
                            <span className="text-muted-foreground font-medium">Dibuat pada</span>
                            <span className="col-span-2">
                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
