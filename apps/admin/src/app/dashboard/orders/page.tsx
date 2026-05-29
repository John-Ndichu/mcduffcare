'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { Search, Eye, ArrowUpDown, Filter } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { formatPrice, debounce } from '@mcduffcare/ui/lib/utils';
import type { Order, OrderStatus } from '@mcduffcare/ui/types';

import { useAdminOrders, useUpdateOrderStatus } from '@mcduffcare/api-client/hooks/use-admin';

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
  refunded: 'secondary',
};

export default function AdminOrdersPage(): React.JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created_at', desc: true }]);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | 'all'>('all');
  const [page, setPage] = React.useState(1);

  const debouncedSetSearch = React.useMemo(
    () => debounce((q: string) => { setDebouncedSearch(q); setPage(1); }, 300),
    [],
  );

  const filters = {
    ...(debouncedSearch !== '' && { search: debouncedSearch }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    page,
    per_page: 20,
  };

  const { data, isLoading } = useAdminOrders(filters);
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: 'Order',
      cell: ({ row }) => (
        <div>
          <p className="font-heading font-bold text-sm text-primary">#{row.original.order_number}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.original.created_at).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">
            {row.original.shipping_address.first_name} {row.original.shipping_address.last_name}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.shipping_address.phone}</p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.items.length} item{row.original.items.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-3 h-8 font-heading">
          Total <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-heading font-bold text-sm text-primary">{formatPrice(row.original.total)}</span>
      ),
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.payment_method.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(v) => updateStatus({ id: row.original.id, status: v })}
        >
          <SelectTrigger className="h-8 w-32 text-xs border-0 bg-transparent p-0 focus:ring-0">
            <Badge variant={STATUS_VARIANT[row.original.status]} className="cursor-pointer capitalize">
              {row.original.status}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href={`/dashboard/orders/${row.original.id}`} aria-label="View order">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data?.meta.last_page ?? 1,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track all customer orders</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              All Orders
              {data !== undefined && <Badge variant="secondary">{data.meta.total}</Badge>}
            </CardTitle>
            <CardDescription className="text-xs">
              {data?.meta.from ?? '–'}–{data?.meta.to ?? '–'} of {data?.meta.total ?? '–'}
            </CardDescription>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}>
              <SelectTrigger className="h-9 w-40 text-sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="search"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); debouncedSetSearch(e.target.value); }}
              leftElement={<Search className="h-4 w-4" />}
              className="h-9 w-56"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Orders table">
              <thead className="border-b bg-muted/40">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold font-heading text-muted-foreground uppercase tracking-wide">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {columns.map((_, ci) => (
                          <td key={ci} className="px-4 py-3"><Skeleton className="h-5 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {data !== undefined && data.meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">Page {data.meta.current_page} of {data.meta.last_page}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.meta.last_page, p + 1))} disabled={page === data.meta.last_page}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
