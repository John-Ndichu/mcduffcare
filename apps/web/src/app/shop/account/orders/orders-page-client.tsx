'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Card, CardContent } from '@mcduffcare/ui/components/ui/card';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { formatPrice } from '@mcduffcare/ui/lib/utils';
import type { OrderStatus } from '@mcduffcare/ui/types';

import { useOrders, useCancelOrder } from '@mcduffcare/api-client/hooks/use-orders';

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' }> = {
  pending:    { label: 'Pending',    variant: 'warning' },
  confirmed:  { label: 'Confirmed',  variant: 'info' },
  processing: { label: 'Processing', variant: 'info' },
  shipped:    { label: 'Shipped',    variant: 'default' },
  delivered:  { label: 'Delivered',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'destructive' },
  refunded:   { label: 'Refunded',   variant: 'secondary' },
};

export function OrdersPageClient(): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useOrders(page);
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();

  return (
    <div className="container py-8 lg:py-12 max-w-4xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/account" className="hover:text-primary">Account</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="font-medium text-foreground">Orders</li>
        </ol>
      </nav>

      <h1 className="mb-8 font-heading text-2xl font-bold">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : data === undefined || data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30" />
          <h2 className="mt-4 font-heading text-lg font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
          <Button asChild className="mt-6">
            <Link href="/shop/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            return (
              <Card key={order.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Order info */}
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-heading font-bold text-sm">#{order.order_number}</p>
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-KE', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                        {' · '}
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      {/* Items preview */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {order.items.slice(0, 3).map((item) => (
                          <span key={item.id} className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                            {item.product.name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Price & actions */}
                    <div className="text-right">
                      <p className="font-heading text-lg font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{order.payment_method.replace('_', ' ')}</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/orders/${order.id}`}>View Details</Link>
                        </Button>
                        {['pending', 'confirmed'].includes(order.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            loading={cancelling}
                            onClick={() => {
                              if (confirm('Cancel this order?')) cancelOrder(order.id);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === data.meta.last_page}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
