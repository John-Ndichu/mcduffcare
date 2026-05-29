'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcduffcare/ui/components/ui/tabs';
import { useFeaturedProducts, useProducts } from '@mcduffcare/api-client/hooks/use-products';

import { ProductCard } from '../product/product-card';
import { ProductCardSkeleton } from '../product/product-card-skeleton';

export function FeaturedProducts(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<'featured' | 'new' | 'offers'>('featured');

  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts(8);
  const { data: newest, isLoading: loadingNewest } = useProducts(
    { sort: 'newest', per_page: 8 },
    { enabled: activeTab === 'new' },
  );
  const { data: offers, isLoading: loadingOffers } = useProducts(
    { sort: 'popular', per_page: 8 },
    { enabled: activeTab === 'offers' },
  );

  const currentData =
    activeTab === 'featured' ? featured :
    activeTab === 'new' ? newest?.data :
    offers?.data;

  const isLoading =
    activeTab === 'featured' ? loadingFeatured :
    activeTab === 'new' ? loadingNewest :
    loadingOffers;

  return (
    <section className="bg-brand-light-blue/40 py-10 lg:py-16" aria-labelledby="products-heading">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="products-heading"
              className="font-heading text-2xl font-bold text-foreground lg:text-3xl"
            >
              Our Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quality health products from trusted brands
            </p>
          </div>
          <Link
            href="/shop/products"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="mb-6 h-auto gap-1 rounded-lg bg-white p-1 shadow-sm">
            <TabsTrigger value="featured" className="rounded-md px-4 py-2 text-sm">
              Featured
            </TabsTrigger>
            <TabsTrigger value="new" className="rounded-md px-4 py-2 text-sm">
              New Arrivals
            </TabsTrigger>
            <TabsTrigger value="offers" className="rounded-md px-4 py-2 text-sm">
              Best Sellers
            </TabsTrigger>
          </TabsList>

          {(['featured', 'new', 'offers'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-4">
                {isLoading && activeTab === tab
                  ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : (currentData ?? []).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
