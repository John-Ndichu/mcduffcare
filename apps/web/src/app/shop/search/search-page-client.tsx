'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

import { Input } from '@mcduffcare/ui/components/ui/input';
import { Button } from '@mcduffcare/ui/components/ui/button';

import { useProducts } from '@mcduffcare/api-client/hooks/use-products';
import { trackSearch } from '@/lib/analytics/gtag';
import { useDebounce } from '@/hooks/use-debounce';

import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import Link from 'next/link';

export function SearchPageClient(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [inputValue, setInputValue] = React.useState(initialQuery);
  const debouncedQuery = useDebounce(inputValue, 400);

  const { data, isLoading } = useProducts(
    { search: debouncedQuery, per_page: 24 },
    { enabled: debouncedQuery.trim().length >= 2 },
  );

  // Track search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      trackSearch(debouncedQuery);
      const params = new URLSearchParams();
      params.set('q', debouncedQuery);
      router.replace(`/shop/search?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, router]);

  const products = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="container py-8 lg:py-12">
      {/* Search box */}
      <div className="mx-auto mb-8 max-w-2xl">
        <h1 className="mb-4 font-heading text-2xl font-bold text-center lg:text-3xl">
          Search Products
        </h1>
        <div className="relative">
          <Input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search medicines, supplements, devices…"
            autoFocus
            leftElement={<Search className="h-4 w-4" />}
            rightElement={
              inputValue !== '' ? (
                <button
                  onClick={() => setInputValue('')}
                  aria-label="Clear search"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
            className="h-12 rounded-xl border-2 border-primary/20 text-base focus-visible:border-primary focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Results */}
      {debouncedQuery.trim().length >= 2 && (
        <>
          {!isLoading && (
            <p className="mb-4 text-sm text-muted-foreground">
              {total > 0 ? (
                <>
                  <strong>{total}</strong> result{total !== 1 ? 's' : ''} for{' '}
                  <strong>&ldquo;{debouncedQuery}&rdquo;</strong>
                </>
              ) : (
                <>No results found for <strong>&ldquo;{debouncedQuery}&rdquo;</strong></>
              )}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="font-heading text-xl font-semibold">No products found</h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Try different keywords or browse our{' '}
                <Link href="/shop/products" className="text-primary hover:underline">
                  full catalogue
                </Link>
                .
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/shop/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty state before typing */}
      {debouncedQuery.trim().length < 2 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Search className="h-12 w-12 opacity-20 mb-4" />
          <p className="text-sm">Start typing to search our full product catalogue</p>
        </div>
      )}
    </div>
  );
}
