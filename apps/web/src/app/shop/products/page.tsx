import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ProductsPageClient } from './products-page-client';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Products – Medicines, Supplements & Health',
  description:
    'Browse hundreds of genuine medicines, vitamins, supplements, skincare and health devices. Filter by category, brand, price and prescription type.',
  alternates: { canonical: '/shop/products' },
  openGraph: {
    title: 'All Products | McDuffCare Online Pharmacy Kenya',
    description: 'Shop genuine medicines, supplements and health products. Fast delivery across Kenya.',
  },
};

function ProductsLoading() {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageClient />
    </Suspense>
  );
}
