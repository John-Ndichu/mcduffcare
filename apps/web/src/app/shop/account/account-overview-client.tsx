'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, FileText, ArrowRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@mcduffcare/ui/components/ui/avatar';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { getInitials } from '@mcduffcare/ui/lib/utils';

import { useCurrentUser } from '@mcduffcare/api-client/hooks/use-auth';
import { useOrders } from '@mcduffcare/api-client/hooks/use-orders';

const quickLinks = [
  { label: 'My Orders', href: '/shop/account/orders', icon: ShoppingBag, description: 'Track and manage orders' },
  { label: 'Wishlist', href: '/shop/account/wishlist', icon: Heart, description: 'Saved products' },
  { label: 'Addresses', href: '/shop/account/addresses', icon: MapPin, description: 'Delivery addresses' },
  { label: 'Prescriptions', href: '/shop/account/prescriptions', icon: FileText, description: 'Uploaded prescriptions' },
];

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  confirmed: 'text-blue-600 bg-blue-50',
  processing: 'text-blue-600 bg-blue-50',
  shipped: 'text-purple-600 bg-purple-50',
  delivered: 'text-emerald-600 bg-emerald-50',
  cancelled: 'text-red-600 bg-red-50',
  refunded: 'text-gray-600 bg-gray-50',
};

export function AccountOverviewClient(): React.JSX.Element {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: orders, isLoading: ordersLoading } = useOrders(1);

  const recentOrders = orders?.data.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="gradient-brand text-white border-0">
        <CardContent className="flex items-center gap-4 p-6">
          {userLoading ? (
            <>
              <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 bg-white/20" />
                <Skeleton className="h-4 w-56 bg-white/20" />
              </div>
            </>
          ) : user !== undefined ? (
            <>
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
                <AvatarFallback className="bg-white/20 text-white font-heading text-lg font-bold">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-xl font-bold">
                  Welcome back, {user.first_name}!
                </h1>
                <p className="text-sm text-white/75">{user.email}</p>
                {user.email_verified_at !== null ? (
                  <Badge className="mt-1 bg-white/20 text-white border-0 text-xs">
                    ✓ Verified Account
                  </Badge>
                ) : (
                  <Badge className="mt-1 bg-amber-400/30 text-white border-0 text-xs">
                    Email not verified
                  </Badge>
                )}
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="ml-auto border-white/30 text-white hover:bg-white/10 hover:text-white hidden sm:flex"
              >
                <Link href="/shop/account/profile">
                  Edit Profile
                </Link>
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map(({ label, href, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-heading font-semibold group-hover:text-primary transition-colors">
              {label}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Link
            href="/shop/account/orders"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/shop/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/shop/account/orders/${order.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-heading font-semibold">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status] ?? 'text-gray-600 bg-gray-50'}`}
                    >
                      {order.status}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
