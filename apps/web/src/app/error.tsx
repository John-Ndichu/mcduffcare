'use client';

import { useEffect } from 'react';
import { Button } from '@mcduffcare/ui/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="font-heading text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-destructive">
          {error.message}
        </pre>
      )}
      <Button onClick={reset} className="mt-8">
        Try Again
      </Button>
    </div>
  );
}
