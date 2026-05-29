'use client';

import * as React from 'react';
import { Tag, Clock } from 'lucide-react';

import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcduffcare/ui/components/ui/tabs';

import { useProducts } from '@mcduffcare/api-client/hooks/use-products';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';

const OFFER_TABS = [
  { value: 'all', label: 'All Deals' },
  { value: 'otc', label: 'OTC Medicine' },
  { value: 'supplement', label: 'Supplements' },
  { value: 'cosmetic', label: 'Skincare & Beauty' },
  { value: 'device', label: 'Health Devices' },
];

export function OffersPageClient(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState('all');

  const { data, isLoading } = useProducts({
    sort: 'popular',
    per_page: 24,
    ...(activeTab !== 'all' && { type: activeTab as 'otc' | 'supplement' | 'cosmetic' | 'device' }),
  });

  const onSaleProducts = (data?.data ?? []).filter((p) => p.compare_price !== null && p.compare_price > p.price);

  return (
    <div className="py-10 lg:py-14">
      {/* Hero banner */}
      <div className="gradient-brand py-14 text-white mb-12">
        <div className="container text-center">
        
          <h1 className="font-heading text-3xl font-bold lg:text-5xl">
            This Week&apos;s Best Deals
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Save up to 40% on top-brand medicines, vitamins, and wellness products.
            New offers added every Monday.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70">
            <Clock className="h-4 w-4" />
            <span>Offers updated weekly · While stocks last</span>
          </div>
        </div>
      </div>

      <div className="container">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 h-auto flex-wrap gap-1 rounded-lg bg-white border p-1.5 shadow-sm">
            {OFFER_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-md px-4 py-2 text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {OFFER_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : onSaleProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Tag className="h-12 w-12 text-muted-foreground/20 mb-4" />
                  <h3 className="font-heading text-lg font-semibold">No offers right now</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Check back on Monday for new weekly deals.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-2">
                    <Badge variant="sale" className="text-sm">{onSaleProducts.length} deals available</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
                    {onSaleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
