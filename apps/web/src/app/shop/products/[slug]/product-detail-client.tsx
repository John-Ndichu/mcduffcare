'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, ChevronRight, Minus, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcduffcare/ui/components/ui/tabs';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Progress } from '@mcduffcare/ui/components/ui/progress';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';
import { cn, formatPrice } from '@mcduffcare/ui/lib/utils';

import { useProduct } from '@mcduffcare/api-client/hooks/use-products';
import { useAddToCart } from '@mcduffcare/api-client/hooks/use-cart';
import { useProductReviews } from '@mcduffcare/api-client/hooks/use-reviews';
import { trackAddToCart, trackViewItem } from '@/lib/analytics/gtag';

interface ProductDetailClientProps {
  readonly slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps): React.JSX.Element {
  const { data: product, isLoading } = useProduct(slug);
  const { data: reviewsData } = useProductReviews(product?.id ?? 0);
  const { mutate: addToCart, isPending } = useAddToCart();

  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<number | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  // Track product view once loaded
  React.useEffect(() => {
    if (product !== undefined) {
      trackViewItem({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
      });
    }
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (product === undefined) return <div className="container py-20 text-center text-muted-foreground">Product not found.</div>;

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null;
  const displayPrice = activeVariant?.price ?? product.price;
  const displayCompare = activeVariant?.compare_price ?? product.compare_price;
  const inStock = (activeVariant?.stock_quantity ?? product.stock_quantity) > 0;
  const discount = displayCompare !== null && displayCompare > displayPrice
    ? Math.round(((displayCompare - displayPrice) / displayCompare) * 100)
    : null;

  const handleAddToCart = () => {
    if (product.requires_prescription) {
      toast.error('A prescription is required for this product.', {
        action: { label: 'Upload Rx', onClick: () => { window.location.href = '/prescriptions'; } },
      });
      return;
    }
    addToCart({
  product_id: product.id,
  ...(selectedVariantId !== null
    ? { variant_id: selectedVariantId }
    : {}),
  quantity,
});
    trackAddToCart({ id: product.id, name: product.name, price: displayPrice, category: product.category.name, quantity });
  };

  const images = product.images.length > 0 ? product.images : (product.primary_image !== null ? [product.primary_image] : []);
  const activeImage = images[selectedImageIdx];

  return (
    <div className="container py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/shop/products" className="hover:text-primary">Products</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href={`/shop/products?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium truncate max-w-xs">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-12">
        {/* ── Image gallery ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            {activeImage !== undefined ? (
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                className="object-contain p-6"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-light-blue to-white" />
            )}
            {discount !== null && (
              <Badge variant="sale" className="absolute left-3 top-3 text-sm px-2.5">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={cn(
                    'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-colors',
                    idx === selectedImageIdx ? 'border-primary' : 'border-transparent hover:border-primary/40',
                  )}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={idx === selectedImageIdx}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-contain p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ───────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.requires_prescription && <Badge variant="rx">Prescription Required</Badge>}
            {product.is_new && <Badge variant="new">New Arrival</Badge>}
            {!inStock && <Badge variant="destructive">Out of Stock</Badge>}
            {product.brand !== null && (
              <Badge variant="secondary">{product.brand.name}</Badge>
            )}
          </div>

          {/* Category + Name */}
          <div>
            <p className="text-sm text-muted-foreground">{product.category.name}</p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-foreground leading-tight lg:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${product.average_rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.round(product.average_rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted',
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.average_rating.toFixed(1)} ({product.reviews_count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3">
            <p className="font-heading text-3xl font-bold text-primary">{formatPrice(displayPrice)}</p>
            {displayCompare !== null && (
              <p className="pb-1 text-lg text-muted-foreground line-through">{formatPrice(displayCompare)}</p>
            )}
            {discount !== null && (
              <Badge variant="sale" className="mb-0.5">Save {discount}%</Badge>
            )}
          </div>

          {/* Prescription warning */}
          {product.requires_prescription && (
            <Alert variant="warning">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                This is a prescription-only medicine. You&apos;ll need to upload a valid
                prescription before your order can be fulfilled.{' '}
                <Link href="/prescriptions" className="font-medium underline">
                  Upload prescription →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold font-heading">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={v.stock_quantity === 0}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      selectedVariantId === v.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:border-primary',
                    )}
                  >
                    {v.name}
                    {v.stock_quantity === 0 && ' (OOS)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Qty stepper */}
            <div className="flex items-center rounded-md border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold font-heading" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              loading={isPending}
              disabled={!inStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => {
                setIsWishlisted((p) => !p);
                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-brand-red text-brand-red')} />
            </Button>

            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Share product"
              onClick={() => {
                void navigator.share?.({ title: product.name, url: window.location.href });
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/40 p-4">
            {[
              { Icon: ShieldCheck, label: 'Genuine Product' },
              { Icon: Truck, label: 'Fast Delivery' },
              { Icon: RotateCcw, label: 'Easy Returns' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* SKU & tags */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>SKU: <span className="font-mono">{product.sku}</span></p>
            {product.tags.length > 0 && (
              <p>Tags: {product.tags.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Reviews ──────────────────────────────────── */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="mb-6 border-b rounded-none bg-transparent p-0 h-auto gap-0 justify-start">
            {['description', 'reviews', 'delivery'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 capitalize data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                {tab}
                {tab === 'reviews' && product.reviews_count > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs">
                    {product.reviews_count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="description">
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection productId={product.id} reviews={reviewsData} />
          </TabsContent>

          <TabsContent value="delivery">
            <div className="space-y-4 text-sm text-muted-foreground max-w-xl">
              <div className="flex gap-3">
                <Truck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold font-heading text-foreground">Standard Delivery</p>
                  <p>2–4 business days across Kenya. Free on orders over KES 2,000.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Truck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold font-heading text-foreground">Same-Day Delivery (Nairobi)</p>
                  <p>Order before 2pm Monday–Saturday for same-day delivery within Nairobi.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <RotateCcw className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold font-heading text-foreground">Returns Policy</p>
                  <p>Return unopened items within 7 days for a full refund. Prescription drugs are non-returnable.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Reviews sub-component ──────────────────────────────────────────────────────
function ReviewsSection({
  // productId,
  reviews,
}: {
  productId: number;
  reviews: { data: Array<{ id: number; user: { full_name: string }; rating: number; title: string; body: string; created_at: string; verified_purchase: boolean }> } | undefined;
}): React.JSX.Element {
  if (reviews === undefined || reviews.data.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p className="font-heading text-base">No reviews yet.</p>
        <p className="mt-1 text-sm">Be the first to review this product.</p>
      </div>
    );
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.data.filter((rv) => rv.rating === r).length,
  }));
  const avg = reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-6 text-center">
          <p className="font-heading text-5xl font-bold text-primary">{avg.toFixed(1)}</p>
          <div className="mt-2 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn('h-4 w-4', i < Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
            ))}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{reviews.data.length} reviews</p>
        </div>
        <div className="space-y-2 sm:col-span-1 lg:col-span-2">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-4 text-right text-sm font-medium">{rating}</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <Progress value={reviews.data.length > 0 ? (count / reviews.data.length) * 100 : 0} className="h-2 flex-1" />
              <span className="w-6 text-sm text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Individual reviews */}
      <div className="space-y-6">
        {reviews.data.map((review) => (
          <article key={review.id} className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold font-heading text-sm">{review.user.full_name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                    ))}
                  </div>
                  {review.verified_purchase && (
                    <Badge variant="success" className="text-2xs px-1 py-0">Verified</Badge>
                  )}
                </div>
              </div>
              <time className="text-xs text-muted-foreground shrink-0">
                {new Date(review.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
            </div>
            <p className="font-heading text-sm font-semibold">{review.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
            <Separator />
          </article>
        ))}
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function ProductDetailSkeleton(): React.JSX.Element {
  return (
    <div className="container py-10">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-16 rounded-lg" />)}</div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
