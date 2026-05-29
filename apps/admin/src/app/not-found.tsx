'use client';

import Link from 'next/link';
import { Button } from '@mcduffcare/ui/components/ui/button';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-heading font-black text-primary/20">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        This admin page doesn&apos;t exist or you don&apos;t have access.
      </p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
