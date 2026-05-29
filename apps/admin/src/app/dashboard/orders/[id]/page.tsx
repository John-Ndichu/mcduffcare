'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { formatPrice } from '@mcduffcare/ui/lib/utils';
import type { OrderStatus } from '@mcduffcare/ui/types';

import { useAdminOrders, useUpdateOrderStatus } from '@mcduffcare/api-client/hooks/use-admin';
import Image from 'next/image';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_VARIANT: Record<OrderStatus, string> = {
  pending: 'warning', confirmed: 'info', processing: 'info',
  shipped: 'default', delivered: 'success', cancelled: 'destructive', refunded: 'secondary',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useAdminOrders({ id: Number(id), per_page: 1 });
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const order = data?.data[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/orders"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">Order #{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString('en-KE')}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant={STATUS_VARIANT[order.status] as Parameters<typeof Badge>[0]['variant']} className="capitalize">
            {order.status}
          </Badge>
          <Select
            value={order.status}
            onValueChange={(v) => updateStatus({ id: order.id, status: v })}
            disabled={isPending}
          >
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4 text-primary" />Order Items ({order.items.length})</CardTitle></CardHeader>
            <CardContent className="p-0 divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-12 w-12 shrink-0 rounded-lg border bg-muted overflow-hidden">
                    {item.product.primary_image && (
                      <Image src={item.product.primary_image.url} alt={item.product.primary_image.alt} className="h-full w-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant.name}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                  </div>
                  <p className="font-heading font-bold text-sm text-primary shrink-0">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
              <div className="px-5 py-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(order.shipping_cost)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
                <Separator />
                <div className="flex justify-between font-heading font-bold text-base"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-semibold text-foreground">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.county}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Payment</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p>
              <Badge variant={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'destructive' : 'warning'} className="capitalize text-xs">
                {order.payment_status}
              </Badge>
            </CardContent>
          </Card>
          {order.notes && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Customer Notes</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground italic">{order.notes}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
