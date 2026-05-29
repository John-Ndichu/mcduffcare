'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, LayoutList, SlidersHorizontal, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mcduffcare/ui/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@mcduffcare/ui/components/ui/sheet';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn } from '@mcduffcare/ui/lib/utils';
import type { ProductFilters } from '@mcduffcare/ui/types';

import { useInfiniteProducts } from '@mcduffcare/api-client/hooks/use-products';

import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import { ProductFiltersPanel } from '@/components/product/product-filters-panel';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

export function ProductsPageClient(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = React.useState(false);

const filters: Omit<ProductFilters, 'page'> = {
  sort: (searchParams.get('sort') as ProductFilters['sort']) ?? 'popular',
};

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts(filters);

  React.useEffect(() => {
    if (inView && hasNextPage === true && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = data?.pages[0]?.meta.total ?? 0;

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
  ].filter(Boolean).length;

  return (
    <div className="container py-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">All Products</li>
        </ol>
      </nav>

      <div className="flex gap-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <ProductFiltersPanel filters={filters} onChange={updateFilter} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ProductFiltersPanel filters={filters} onChange={updateFilter} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Result count */}
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="inline-block h-4 w-24" />
              ) : (
                <>Showing <strong>{allProducts.length}</strong> of <strong>{totalCount}</strong> products</>
              )}
            </p>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive hover:text-destructive">
                <X className="h-3.5 w-3.5" />
                Clear all
              </Button>
            )}

            {/* Spacer */}
            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <Select value={filters.sort ?? 'popular'} onValueChange={(v) => updateFilter('sort', v)}>
                <SelectTrigger className="h-9 w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Layout toggle */}
              <div className="flex rounded-md border">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setLayout('grid')}
                  aria-label="Grid view"
                  className={cn('rounded-r-none', layout === 'grid' && 'bg-accent')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setLayout('list')}
                  aria-label="List view"
                  className={cn('rounded-l-none', layout === 'list' && 'bg-accent')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products grid/list */}
          {isLoading ? (
            <div className={cn(
              layout === 'grid'
                ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4'
                : 'flex flex-col gap-3',
            )}>
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="font-heading text-xl font-semibold">No products found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search term.</p>
              <Button className="mt-6" onClick={clearAllFilters}>Clear filters</Button>
            </div>
          ) : (
            <div className={cn(
              layout === 'grid'
                ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4'
                : 'flex flex-col gap-3',
            )}>
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout={layout} />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
