'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus, X, ArrowRight } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@mcduffcare/ui/components/ui/sheet';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { ScrollArea } from '@mcduffcare/ui/components/ui/scroll-area';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { formatPrice } from '@mcduffcare/ui/lib/utils';

import { useCart, useUpdateCartItem, useRemoveCartItem } from '@mcduffcare/api-client/hooks/use-cart';
import { useCartUI } from '@/store';

export function CartDrawer(): React.JSX.Element {
  const { isOpen, closeCart } = useCartUI();
  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart
            {cart !== undefined && cart.items_count > 0 && (
              <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs">
                {cart.items_count}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : cart === undefined || cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add some products to get started</p>
            </div>
            <Button onClick={closeCart} asChild>
              <Link href="/shop/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-5">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Link href={`/shop/products/${item.product.slug}`} onClick={closeCart} className="shrink-0">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted border">
                        {item.product.primary_image !== null ? (
                          <Image
                            src={item.product.primary_image.url}
                            alt={item.product.primary_image.alt}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : <div className="h-full w-full bg-brand-light-blue" />}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/shop/products/${item.product.slug}`} onClick={closeCart} className="font-heading text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove"
                          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded border">
                          <button
                            onClick={() => item.quantity > 1 ? updateItem({ itemId: item.id, quantity: item.quantity - 1 }) : removeItem(item.id)}
                            className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
                            className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-heading text-sm font-bold text-primary">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-5 space-y-4">
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount applied</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold">Total</span>
                <span className="font-heading text-xl font-bold text-primary">
                  {formatPrice(cart.total)}
                </span>
              </div>
            <Button asChild size="lg" className="w-full" onClick={closeCart}>
  <Link href="/shop/checkout">
    <span className="flex items-center gap-1">
      Checkout <ArrowRight className="h-5 w-5" />
    </span>
  </Link>
</Button>
              <Button asChild variant="outline" size="sm" className="w-full" onClick={closeCart}>
                <Link href="/shop/cart">View Full Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
