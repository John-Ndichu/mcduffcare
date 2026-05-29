'use client';

import { useEffect } from 'react';
import { Button } from '@mcduffcare/ui/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Admin global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-body antialiased bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="font-heading text-xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            An unexpected error occurred in the admin panel.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-destructive">
              {error.message}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={reset}>Try Again</Button>
            <Button onClick={() => { window.location.href = '/dashboard'; }}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
