'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { useWishlist } from '@/store';
import { useProducts } from '@mcduffcare/api-client/hooks/use-products';
// import { useAddToCart } from '@mcduffcare/api-client/hooks/use-cart';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';

export default function WishlistPage() {
  const { productIds, toggle } = useWishlist();
 // const { mutate: addToCart } = useAddToCart();

  const { data, isLoading } = useProducts(
    { per_page: 50 },
    { enabled: productIds.length > 0 },
  );

  // Filter to only wishlisted products
  const wishlisted = (data?.data ?? []).filter((p) => productIds.includes(p.id));

  if (productIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/20" />
        <h1 className="mt-4 font-heading text-xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save products you love by clicking the heart icon.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">
          Wishlist
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({productIds.length} item{productIds.length !== 1 ? 's' : ''})
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => productIds.forEach((id) => toggle(id))}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          {Array.from({ length: productIds.length }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          {wishlisted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
