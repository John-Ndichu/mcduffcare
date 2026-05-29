'use client';

import Link from 'next/link';
import { Button } from '@mcduffcare/ui/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-heading text-2xl font-bold">Product not found</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        This product may have been removed or the link is incorrect.
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
