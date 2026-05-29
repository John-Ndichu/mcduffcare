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
import { Search, Eye, ArrowUpDown, UserCheck, UserX } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@mcduffcare/ui/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { getInitials, debounce } from '@mcduffcare/ui/lib/utils';
import type { User } from '@mcduffcare/ui/types';

import { useAdminCustomers } from '@mcduffcare/api-client/hooks/use-admin';

export default function AdminCustomersPage(): React.JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created_at', desc: true }]);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const debouncedSetSearch = React.useMemo(
    () => debounce((q: string) => { setDebouncedSearch(q); setPage(1); }, 300),
    [],
  );

  const { data, isLoading } = useAdminCustomers({
    ...(debouncedSearch !== '' && { search: debouncedSearch }),
    page,
    per_page: 20,
  });

  const columns: ColumnDef<User>[] = [
    {
      id: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar_url ?? undefined} alt={row.original.full_name} />
            <AvatarFallback className="text-xs">{getInitials(row.original.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.original.full_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.phone ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'email_verified_at',
      header: 'Verified',
      cell: ({ row }) => (
        row.original.email_verified_at !== null
          ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><UserCheck className="h-3.5 w-3.5" /> Verified</span>
          : <span className="flex items-center gap-1 text-xs text-muted-foreground"><UserX className="h-3.5 w-3.5" /> Unverified</span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize text-xs">{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-3 h-8 font-heading">
          Joined <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: '2-digit' })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href={`/dashboard/customers/${row.original.id}`} aria-label={`View ${row.original.full_name}`}>
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
        <h1 className="font-heading text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">View and manage registered customers</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              All Customers
              {data !== undefined && <Badge variant="secondary">{data.meta.total}</Badge>}
            </CardTitle>
            <CardDescription className="text-xs">
              {data?.meta.from ?? '–'}–{data?.meta.to ?? '–'} of {data?.meta.total ?? '–'}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); debouncedSetSearch(e.target.value); }}
              leftElement={<Search className="h-4 w-4" />}
              className="h-9 w-64"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Customers table">
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
