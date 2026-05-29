'use client';

import Link from 'next/link';
import { Button } from '@mcduffcare/ui/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-heading font-black text-primary/20">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link href="/shop/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
