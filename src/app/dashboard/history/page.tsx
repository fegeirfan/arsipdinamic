import { Clock } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="bg-sidebar-accent/10 p-6 rounded-full">
                <Clock className="h-12 w-12 text-sidebar-accent" />
            </div>
            <h1 className="text-2xl font-bold">Riwayat Aktivitas</h1>
            <p className="text-muted-foreground text-center max-w-md">
                Lihat daftar arsip yang terakhir Anda buka atau ubah untuk mempermudah melanjutkan pekerjaan.
            </p>
        </div>
    );
}
