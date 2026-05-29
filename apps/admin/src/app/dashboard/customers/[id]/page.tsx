'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, UserCheck, UserX, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@mcduffcare/ui/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { getInitials, formatPrice } from '@mcduffcare/ui/lib/utils';

import { useAdminCustomers, useAdminOrders } from '@mcduffcare/api-client/hooks/use-admin';

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customers, isLoading } = useAdminCustomers({ id: Number(id), per_page: 1 });
  const customer = customers?.data[0];

  const { data: orders } = useAdminOrders(
    { customer_id: Number(id), per_page: 5 },
    { enabled: !!customer },
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Customer not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/customers">Back to Customers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/customers"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">Customer Profile</h1>
          <p className="text-sm text-muted-foreground">ID #{customer.id}</p>
        </div>
      </div>

      {/* Profile card */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-6 p-6">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={customer.avatar_url ?? undefined} alt={customer.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-heading text-xl font-bold">
              {getInitials(customer.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-bold">{customer.full_name}</h2>
              <Badge variant="secondary" className="capitalize">{customer.role}</Badge>
              {customer.email_verified_at
                ? <Badge variant="success" className="text-xs"><UserCheck className="h-3 w-3 mr-0.5" />Verified</Badge>
                : <Badge variant="warning" className="text-xs"><UserX className="h-3 w-3 mr-0.5" />Unverified</Badge>
              }
            </div>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{customer.email}</span>
              {customer.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{customer.phone}</span>}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined {new Date(customer.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      {customer.addresses.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Saved Addresses ({customer.addresses.length})</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {customer.addresses.map((addr) => (
              <div key={addr.id} className="rounded-lg border bg-muted/30 p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-heading font-semibold">{addr.label}</p>
                  {addr.is_default && <Badge variant="default" className="text-xs">Default</Badge>}
                </div>
                <div className="space-y-0.5 text-muted-foreground">
                  <p>{addr.first_name} {addr.last_name} · {addr.phone}</p>
                  <p>{addr.address_line_1}</p>
                  {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                  <p>{addr.city}, {addr.county}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!orders || orders.data.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <ul className="divide-y">
              {orders.data.map((order) => (
                <li key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-KE')}
                      {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize text-xs shrink-0">{order.status}</Badge>
                  <p className="font-heading font-bold text-sm text-primary shrink-0">{formatPrice(order.total)}</p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
