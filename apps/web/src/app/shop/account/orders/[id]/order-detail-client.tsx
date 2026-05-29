'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronRight, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, CreditCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { formatPrice } from '@mcduffcare/ui/lib/utils';
import type { OrderStatus } from '@mcduffcare/ui/types';

import { useOrder, useCancelOrder } from '@mcduffcare/api-client/hooks/use-orders';

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:    Clock,
  confirmed:  CheckCircle2,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle2,
  cancelled:  XCircle,
  refunded:   XCircle,
};

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  pending:    'warning',
  confirmed:  'info',
  processing: 'info',
  shipped:    'default',
  delivered:  'success',
  cancelled:  'destructive',
  refunded:   'secondary',
};

export function OrderDetailClient() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  const { data: order, isLoading } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/shop/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
  const isCancellable = ['pending', 'confirmed'].includes(order.status);
  const currentStepIndex = STATUS_STEPS.indexOf(order.status as OrderStatus);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link href="/shop/account" className="hover:text-primary">Account</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/shop/account/orders" className="hover:text-primary">Orders</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="font-medium text-foreground">#{order.order_number}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Order #{order.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[order.status]} className="text-sm px-3 py-1 capitalize">
            <StatusIcon className="h-4 w-4 mr-1.5" />
            {order.status}
          </Badge>
          {isCancellable && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
              loading={cancelling}
              onClick={() => {
                if (confirm('Cancel this order? This cannot be undone.')) {
                  cancelOrder(order.id);
                }
              }}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <Card>
          <CardContent className="py-6">
            <div className="relative flex items-start justify-between">
              {/* Progress line */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted" aria-hidden="true" />
              <div
                className="absolute left-0 top-5 h-0.5 bg-primary transition-all"
                style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
                aria-hidden="true"
              />

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative flex flex-col items-center gap-2 z-10" style={{ flex: 1 }}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isCurrent
                        ? 'border-primary bg-primary text-white'
                        : isPassed
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}>
                      {React.createElement(STATUS_ICONS[step] ?? Clock, { className: 'h-5 w-5' })}
                    </div>
                    <span className={`hidden sm:block text-xs font-medium text-center capitalize ${isCurrent ? 'text-primary' : isPassed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            {order.estimated_delivery && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Estimated delivery: <strong>{new Date(order.estimated_delivery).toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Order Items</CardTitle></CardHeader>
            <CardContent className="divide-y p-0">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-5 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {item.product.primary_image ? (
                      <Image
                        src={item.product.primary_image.url}
                        alt={item.product.primary_image.alt}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full bg-brand-light-blue" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/products/${item.product.slug}`} className="font-heading font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant.name}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading font-bold text-sm text-primary">{formatPrice(item.subtotal)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.unit_price)} each</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          {/* Order summary */}
          <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (VAT)</span><span>{formatPrice(order.tax)}</span></div>
              <Separator />
              <div className="flex justify-between font-heading font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Shipping To</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.county}</p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Payment</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="capitalize font-medium">{order.payment_method.replace('_', ' ')}</p>
              <Badge variant={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'destructive' : 'warning'} className="capitalize text-xs">
                {order.payment_status}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
