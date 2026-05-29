import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchPageClient } from './search-page-client';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ?? '';
  return {
    title: query !== '' ? `Search: "${query}"` : 'Search Products',
    description: `Search results for ${query} at McDuffCare Online Pharmacy Kenya.`,
    robots: { index: false, follow: true },
  };
}

function SearchLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="mx-auto mb-8 h-12 max-w-2xl rounded-xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPageClient />
    </Suspense>
  );
}
