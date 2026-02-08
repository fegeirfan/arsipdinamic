'use client'

import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4 animate-in fade-in duration-500">
            <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <Loader2 className="h-12 w-12 animate-spin text-primary absolute top-0 left-0 clip-path-half" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-semibold tracking-tight">Memuat Halaman...</h3>
                <p className="text-sm text-muted-foreground animate-pulse">Mohon tunggu sebentar</p>
            </div>

            <style jsx>{`
        .clip-path-half {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }
      `}</style>
        </div>
    );
}
