'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@mcduffcare/ui/components/ui/tooltip';
import { cn, formatPrice } from '@mcduffcare/ui/lib/utils';
import type { Product } from '@mcduffcare/ui/types';
import { useAddToCart } from '@mcduffcare/api-client/hooks/use-cart';

interface ProductCardProps {
  readonly product: Product;
  readonly className?: string;
  readonly layout?: 'grid' | 'list';
}

export function ProductCard({
  product,
  className,
  layout = 'grid',
}: ProductCardProps): React.JSX.Element {
  const { mutate: addToCart, isPending } = useAddToCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const discount =
    product.compare_price !== null && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.requires_prescription) {
      toast.error('This product requires a prescription. Please upload your prescription first.');
      return;
    }
    addToCart({ product_id: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted((prev) => !prev);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (layout === 'list') {
    return (
      <Link
        href={`/shop/products/${product.slug}`}
        className={cn(
          'group flex gap-4 rounded-xl border bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover',
          className,
        )}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          {product.primary_image !== null ? (
            <Image
              src={product.primary_image.url}
              alt={product.primary_image.alt}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="96px"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-light-blue to-white" />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap gap-1 mb-1">
              {product.requires_prescription && <Badge variant="rx">Rx</Badge>}
              {product.is_new && <Badge variant="new">New</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{product.category.name}</p>
            <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.average_rating > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{product.average_rating.toFixed(1)} ({product.reviews_count})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-heading text-base font-bold text-primary">{formatPrice(product.price)}</p>
              {product.compare_price !== null && (
                <p className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_price)}</p>
              )}
            </div>
            <Button size="sm" onClick={handleAddToCart} loading={isPending} disabled={isOutOfStock}>
              <ShoppingCart className="h-3.5 w-3.5" />
              {isOutOfStock ? 'Out of Stock' : 'Add'}
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
          className,
        )}
      >
        <Link href={`/shop/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted" tabIndex={-1} aria-hidden="true">
          {product.primary_image !== null ? (
            <Image
              src={product.primary_image.url}
              alt={product.primary_image.alt}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-light-blue/50 to-white" />
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount !== null && (
              <Badge variant="sale">-{discount}%</Badge>
            )}
            {product.is_new && <Badge variant="new">New</Badge>}
            {product.requires_prescription && <Badge variant="rx">Rx</Badge>}
            {isLowStock && (
              <Badge variant="warning" className="text-2xs">Low Stock</Badge>
            )}
          </div>

          <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleWishlist}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white',
                    isWishlisted && 'bg-brand-red text-white hover:bg-brand-red/80',
                  )}
                >
                  <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/shop/products/${product.slug}`}
                  aria-label={`Quick view ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">Quick view</TooltipContent>
            </Tooltip>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-3">
          <Link href={`/shop/products/${product.slug}`} className="flex-1">
            <p className="text-xs text-muted-foreground">{product.category.name}</p>
            <h3 className="mt-0.5 font-heading text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.brand !== null && (
              <p className="mt-0.5 text-xs text-muted-foreground">{product.brand.name}</p>
            )}
            {product.average_rating > 0 && (
              <div className="mt-1.5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.round(product.average_rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted',
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
              </div>
            )}
          </Link>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="font-heading text-base font-bold text-primary leading-none">
                {formatPrice(product.price)}
              </p>
              {product.compare_price !== null && (
                <p className="mt-0.5 text-xs text-muted-foreground line-through">
                  {formatPrice(product.compare_price)}
                </p>
              )}
            </div>
            <Button
              size="icon-sm"
              onClick={handleAddToCart}
              loading={isPending}
              disabled={isOutOfStock}
              aria-label={`Add ${product.name} to cart`}
              className="shrink-0"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>

          {isOutOfStock && (
            <p className="mt-2 text-center text-xs font-medium text-destructive">
              Out of stock
            </p>
          )}
        </div>
      </article>
    </TooltipProvider>
  );
}
