'use client';

import * as React from 'react';
import { Truck, MapPin, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { formatPrice } from '@mcduffcare/ui/lib/utils';

import { useAdminOrders } from '@mcduffcare/api-client/hooks/use-admin';

const DELIVERY_ZONES = [
  { label: 'All Zones', value: 'all' },
  { label: 'Nairobi CBD', value: 'cbd' },
  { label: 'Westlands', value: 'westlands' },
  { label: 'Eastlands', value: 'eastlands' },
  { label: 'South B/C', value: 'south' },
  { label: 'Kiambu', value: 'kiambu' },
  { label: 'Nationwide', value: 'nationwide' },
];

export default function AdminDeliveriesPage(): React.JSX.Element {
  const [zone, setZone] = React.useState('all');

  // Fetch shipped/processing orders as pending deliveries
  const { data: shippedOrders, isLoading } = useAdminOrders({ status: 'shipped', per_page: 20 });
  const { data: processingOrders } = useAdminOrders({ status: 'processing', per_page: 20 });

  const deliveryStats = [
    {
      label: 'Out for Delivery',
      value: shippedOrders?.meta.total ?? 0,
      icon: Truck,
      color: 'text-blue-700 bg-blue-50',
    },
    {
      label: 'Awaiting Dispatch',
      value: processingOrders?.meta.total ?? 0,
      icon: Package,
      color: 'text-amber-700 bg-amber-50',
    },
    {
      label: 'Delivered Today',
      value: 0,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      label: 'Failed Deliveries',
      value: 0,
      icon: XCircle,
      color: 'text-red-700 bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Deliveries</h1>
          <p className="text-sm text-muted-foreground">Track and manage all delivery operations</p>
        </div>
        <Select value={zone} onValueChange={setZone}>
          <SelectTrigger className="w-40 h-9">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELIVERY_ZONES.map((z) => (
              <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {deliveryStats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-heading text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Deliveries</CardTitle>
          <CardDescription>Orders currently out for delivery</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (shippedOrders?.data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Truck className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No active deliveries</p>
            </div>
          ) : (
            <ul className="divide-y">
              {(shippedOrders?.data ?? []).map((order) => (
                <li key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-sm">#{order.order_number}</p>
                      <Badge variant="info" className="text-xs">Shipped</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                      {' · '}
                      {order.shipping_address.city}, {order.shipping_address.county}
                    </p>
                    {order.estimated_delivery !== null && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        ETA: {new Date(order.estimated_delivery).toLocaleDateString('en-KE')}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading font-bold text-sm text-primary">
                      {formatPrice(order.total)}
                    </p>
                    <Button variant="outline" size="sm" className="mt-1 text-xs h-7">
                      Mark Delivered
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
