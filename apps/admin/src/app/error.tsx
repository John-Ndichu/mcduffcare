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
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="font-heading text-xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        An unexpected error occurred in this section.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-destructive">
          {error.message}
        </pre>
      )}
      <Button onClick={reset} className="mt-6" size="sm">
        Try Again
      </Button>
    </div>
  );
}
