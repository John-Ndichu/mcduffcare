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
import { Plus, Search, Pencil, Trash2, ArrowUpDown } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@mcduffcare/ui/components/ui/card';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn, formatPrice, debounce } from '@mcduffcare/ui/lib/utils';
import type { Product } from '@mcduffcare/ui/types';

import { useAdminProducts, useDeleteProduct } from '@mcduffcare/api-client/hooks/use-admin';

export default function AdminProductsPage(): React.JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const debouncedSetSearch = React.useMemo(
    () => debounce((q: string) => setDebouncedSearch(q), 300),
    [],
  );

  const { data, isLoading } = useAdminProducts({
    search: debouncedSearch,
    page,
    per_page: 20,
  });

  const { mutate: deleteProduct } = useDeleteProduct();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 font-heading"
        >
          Product
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.sku}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.category.name}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'rx' ? 'rx' : 'otc'} className="uppercase">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 font-heading"
        >
          Price
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-heading font-semibold text-sm text-primary">
          {formatPrice(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Stock',
      cell: ({ row }) => {
        const qty = row.original.stock_quantity;
        const low = row.original.low_stock_threshold;
        return (
          <span
            className={cn(
              'text-sm font-medium',
              qty === 0
                ? 'text-destructive'
                : qty <= low
                ? 'text-amber-600'
                : 'text-emerald-600',
            )}
          >
            {qty}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'active'
                ? 'success'
                : status === 'out_of_stock'
                ? 'destructive'
                : 'secondary'
            }
            className="capitalize"
          >
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/dashboard/products/${row.original.id}/edit`} aria-label={`Edit ${row.original.name}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete "${row.original.name}"? This cannot be undone.`)) {
                deleteProduct(row.original.id);
              }
            }}
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your pharmacy product catalogue
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-base">
              All Products
              {data !== undefined && (
                <Badge variant="secondary" className="ml-2">{data.meta.total}</Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {data?.meta.from ?? '–'}–{data?.meta.to ?? '–'} of {data?.meta.total ?? '–'}
            </CardDescription>
          </div>
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSetSearch(e.target.value);
              setPage(1);
            }}
            leftElement={<Search className="h-4 w-4" />}
            className="h-9 w-64"
          />
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Products table">
              <thead className="border-b bg-muted/40">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold font-heading text-muted-foreground uppercase tracking-wide"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                          <td key={ci} className="px-4 py-3">
                            <Skeleton className="h-5 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
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

          {/* Pagination */}
          {data !== undefined && data.meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.meta.last_page, p + 1))}
                  disabled={page === data.meta.last_page}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
