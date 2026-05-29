'use client';

import { useEffect } from 'react';
import { Button } from '@mcduffcare/ui/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to your error tracking service here
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="font-heading text-2xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-destructive">
              {error.message}
            </pre>
          )}
          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={reset}>
              Try Again
            </Button>
            <Button onClick={() => { window.location.href = '/'; }}>
              Go Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
