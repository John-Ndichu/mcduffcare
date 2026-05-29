'use client';

import * as React from 'react';
import { Upload, FileText, CheckCircle, XCircle, Info } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { cn } from '@mcduffcare/ui/lib/utils';

export default function PrescriptionsPage() {
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(f.type),
    );
    setFiles((prev) => [...prev, ...valid].slice(0, 3));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setUploading(true);
    // TODO: POST to /prescriptions with FormData
    await new Promise<void>((r) => setTimeout(r, 1500));
    setUploading(false);
    setUploaded(true);
  };

  const mockHistory = [
    { id: 1, filename: 'prescription-jan.jpg', status: 'approved' as const, date: '2025-01-10', notes: 'Approved. Metformin 500mg dispensed.' },
    { id: 2, filename: 'rx-dec-2024.pdf', status: 'rejected' as const, date: '2024-12-15', notes: 'Expired prescription. Please renew.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Prescriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload valid prescriptions from your doctor for Rx-only products.
        </p>
      </div>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Our pharmacists review all prescriptions within 2 hours during business hours (Mon–Sat, 8am–8pm).
          You&apos;ll receive an SMS confirmation once approved.
        </AlertDescription>
      </Alert>

      {/* Upload area */}
      {!uploaded ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Prescription</CardTitle>
            <CardDescription>JPG, PNG, WebP or PDF · Max 5MB per file · Up to 3 files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors',
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/20',
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              aria-label="Upload prescription files"
            >
              <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-heading font-semibold">Drag & drop files here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse your device</p>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Selected files */}
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2.5">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, idx) => idx !== i)); }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button
              onClick={handleSubmit}
              loading={uploading}
              disabled={files.length === 0}
              className="w-full"
              size="lg"
            >
              <Upload className="h-4 w-4" />
              Submit Prescription{files.length > 1 ? 's' : ''}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
            <h3 className="mt-4 font-heading text-lg font-bold text-emerald-900">
              Prescription Submitted!
            </h3>
            <p className="mt-2 text-sm text-emerald-700 max-w-sm">
              Our pharmacist team will review it shortly. You&apos;ll receive an SMS update.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={() => { setUploaded(false); setFiles([]); }}
            >
              Upload Another
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold">Upload History</h2>
        {mockHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No prescriptions uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {mockHistory.map((rx) => (
              <Card key={rx.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    rx.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600',
                  )}>
                    {rx.status === 'approved'
                      ? <CheckCircle className="h-5 w-5" />
                      : <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{rx.filename}</p>
                      <Badge variant={rx.status === 'approved' ? 'success' : 'destructive'} className="text-xs capitalize shrink-0">
                        {rx.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Uploaded: {new Date(rx.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {rx.notes && <p className="text-xs italic text-muted-foreground mt-0.5">{rx.notes}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
