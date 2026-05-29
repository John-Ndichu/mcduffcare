'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, Tag, ArrowRight, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { formatPrice } from '@mcduffcare/ui/lib/utils';

import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useApplyCoupon,
  useRemoveCoupon,
} from '@mcduffcare/api-client/hooks/use-cart';

const couponSchema = z.object({ code: z.string().min(1, 'Enter a coupon code') });
type CouponForm = z.infer<typeof couponSchema>;

export function CartPageClient(): React.JSX.Element {
  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveCartItem();
  const { mutate: applyCoupon, isPending: applyingCoupon } = useApplyCoupon();
  const { mutate: removeCoupon, isPending: removingCoupon } = useRemoveCoupon();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponForm>({ resolver: zodResolver(couponSchema) });

  if (isLoading) return <CartSkeleton />;

  if (cart === undefined || cart.items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" aria-hidden="true" />
        <h1 className="mt-6 font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/shop/products">
            <ShoppingBag className="h-5 w-5" />
            Browse Products
          </Link>
        </Button>
      </div>
    );
  }

  const onApplyCoupon = (data: CouponForm) => applyCoupon(data.code);

  return (
    <div className="container py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="font-medium text-foreground">Cart</li>
        </ol>
      </nav>

      <h1 className="mb-8 font-heading text-2xl font-bold lg:text-3xl">
        Shopping Cart
        <Badge variant="secondary" className="ml-3 text-base">{cart.items_count}</Badge>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
        {/* ── Cart items ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border bg-white p-4 shadow-card"
            >
              {/* Image */}
              <Link href={`/shop/products/${item.product.slug}`} className="shrink-0">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24">
                  {item.product.primary_image !== null ? (
                    <Image
                      src={item.product.primary_image.url}
                      alt={item.product.primary_image.alt}
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full bg-brand-light-blue" />
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/products/${item.product.slug}`}
                      className="font-heading text-sm font-semibold hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant !== null && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variant.name}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.product.category.name}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={removing}
                    aria-label={`Remove ${item.product.name}`}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {/* Qty stepper */}
                  <div className="flex items-center rounded-md border">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateItem({ itemId: item.id, quantity: item.quantity - 1 })
                          : removeItem(item.id)
                      }
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold font-heading" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-heading font-bold text-primary">
                      {formatPrice(item.subtotal)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/shop/products"
            className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order summary ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Coupon */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4 text-primary" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.coupon_code !== null ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">{cart.coupon_code}</p>
                    <p className="text-xs text-emerald-600">
                      Saving {formatPrice(cart.discount)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCoupon()}
                    disabled={removingCoupon}
                    className="text-xs text-emerald-700 hover:text-destructive underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onApplyCoupon)} className="flex gap-2">
                  <Input
                    {...register('code')}
                    placeholder="Enter coupon code"
                    error={errors.code !== undefined}
                    className="h-9 text-sm"
                  />
                  <Button type="submit" size="sm" loading={applyingCoupon} className="shrink-0">
                    Apply
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({cart.items_count} items)</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={cart.shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                  {cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (16% VAT)</span>
                <span className="font-medium">{formatPrice(cart.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-heading font-bold">Total</span>
                <span className="font-heading text-xl font-bold text-primary">
                  {formatPrice(cart.total)}
                </span>
              </div>

              <Button asChild size="lg" className="w-full mt-2">
                <Link href="/shop/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Secure checkout. M-Pesa, Visa & Mastercard accepted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton(): React.JSX.Element {
  return (
    <div className="container py-8">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
