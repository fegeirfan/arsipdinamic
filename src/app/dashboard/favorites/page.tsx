import { Star } from 'lucide-react';

export default function FavoritesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="bg-sidebar-accent/10 p-6 rounded-full">
                <Star className="h-12 w-12 text-sidebar-accent" />
            </div>
            <h1 className="text-2xl font-bold">Arsip Favorit</h1>
            <p className="text-muted-foreground text-center max-w-md">
                Simpan arsip yang sering Anda akses ke daftar favorit untuk menemukannya dengan lebih cepat.
            </p>
        </div>
    );
}
