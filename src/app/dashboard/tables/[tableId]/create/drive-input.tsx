'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, CheckCircle, AlertCircle, Link as LinkIcon, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface DriveInputProps {
    name: string
    scriptUrl?: string
    required?: boolean
    defaultValue?: string
}

export function DriveInput({ name, scriptUrl, required, defaultValue }: DriveInputProps) {
    const [file, setFile] = useState<File | null>(null)
    const [url, setUrl] = useState(defaultValue || '')
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus('idle')
        }
    }

    const handleUpload = async () => {
        if (!file) return
        if (!scriptUrl) {
            toast.error('Google Apps Script URL belum dikonfigurasi pada kolom ini.')
            return
        }

        setStatus('uploading')

        // Convert file to base64 because simple GAS deployments often handle base64 easier 
        // than multipart/form-data due to body parsing limits or complexity.
        // But standard multipart is better for size. Let's try standard standard fetch first.
        // NOTE: User must handle CORS in GAS using:
        // ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async () => {
            const base64 = reader.result?.toString().split(',')[1] // remove data:mime;base64,

            const payload = {
                filename: file.name,
                mimeType: file.type,
                file: base64
            }

            try {
                // We use no-cors if just triggering, but we need response.
                // Simple POST with textual payload is safer for GAS.
                const res = await fetch(scriptUrl, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                })

                const data = await res.json()
                if (data.url) {
                    setUrl(data.url)
                    setStatus('success')
                    toast.success('File berhasil diupload ke Drive!')
                } else {
                    throw new Error('No URL returned from script')
                }
            } catch (e) {
                console.error(e)
                setStatus('error')
                toast.error('Gagal upload. Pastikan Script URL valid dan CORS diizinkan.')
            }
        }
    }

    return (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/10">
            {/* Hidden input to store the actual URL for the form submission */}
            <input type="hidden" name={name} value={url} required={required} />

            {!url ? (
                <div className="flex gap-2 items-end">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            disabled={status === 'uploading'}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file || status === 'uploading' || !scriptUrl}
                        variant="secondary"
                    >
                        {status === 'uploading' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        <span className="sr-only sm:not-sr-only sm:ml-2">Upload</span>
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold">File Uploaded</p>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline truncate block">
                            {url}
                        </a>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setUrl('')
                            setFile(null)
                            setStatus('idle')
                        }}
                    >
                        Change
                    </Button>
                </div>
            )}

            {status === 'error' && (
                <div className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Upload failed. Check console and script config.
                </div>
            )}

            {!scriptUrl && (
                <div className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Konfigurasi URL belum diatur di Table builder.
                </div>
            )}
        </div>
    )
}
