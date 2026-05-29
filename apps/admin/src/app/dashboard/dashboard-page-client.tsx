'use client';

import * as React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@mcduffcare/ui/components/ui/tabs';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn, formatPrice, formatNumber } from '@mcduffcare/ui/lib/utils';

import {
  useDashboardStats,
  useRevenueData,
  useTopProducts,
} from '@mcduffcare/api-client/hooks/use-admin';

type Period = 'week' | 'month' | 'year';

export function DashboardPageClient(): React.JSX.Element {
  const [period, setPeriod] = React.useState<Period>('month');

  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: revenue, isLoading: loadingRevenue } = useRevenueData(period);
  const { data: topProducts, isLoading: loadingTop } = useTopProducts(5);

  const statCards = stats !== undefined
    ? [
        {
          title: 'Total Revenue',
          value: formatPrice(stats.total_revenue),
          change: stats.revenue_change,
          icon: DollarSign,
          color: 'text-brand-royal bg-brand-light-blue',
        },
        {
          title: 'Total Orders',
          value: formatNumber(stats.total_orders),
          change: stats.orders_change,
          icon: ShoppingBag,
          color: 'text-emerald-700 bg-emerald-50',
        },
        {
          title: 'Customers',
          value: formatNumber(stats.total_customers),
          change: stats.customers_change,
          icon: Users,
          color: 'text-purple-700 bg-purple-50',
        },
        {
          title: 'Avg Order Value',
          value: formatPrice(stats.average_order_value),
          change: stats.aov_change,
          icon: BarChart3,
          color: 'text-amber-700 bg-amber-50',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : statCards.map(({ title, value, change, icon: Icon, color }) => (
              <Card key={title} className="hover:shadow-card-hover transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="font-medium">{title}</CardDescription>
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', color)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-2xl font-bold">{value}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {change >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        change >= 0 ? 'text-emerald-600' : 'text-destructive',
                      )}
                    >
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs last {period}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue and orders over time</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList>
              <TabsTrigger value="week">7 Days</TabsTrigger>
              <TabsTrigger value="month">30 Days</TabsTrigger>
              <TabsTrigger value="year">12 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loadingRevenue ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={revenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220 72% 47%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(220 72% 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) =>
                    period === 'year'
                      ? format(parseISO(d), 'MMM')
                      : format(parseISO(d), 'd MMM')
                  }
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => `KES ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  formatter={(v: number, name: string) =>
                    name === 'revenue' ? [formatPrice(v), 'Revenue'] : [formatNumber(v), 'Orders']
                  }
                  labelFormatter={(l: string) => format(parseISO(l), 'dd MMM yyyy')}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(220 72% 47%)"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best-selling products this {period}</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTop ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <ol className="space-y-3">
                {(topProducts ?? []).map(({ product, total_sold, total_revenue }, idx) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold font-heading text-muted-foreground">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(total_sold)} sold</p>
                    </div>
                    <p className="text-sm font-semibold font-heading text-primary shrink-0">
                      {formatPrice(total_revenue)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Orders by status bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current breakdown of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  { status: 'Pending', count: 12, fill: '#f59e0b' },
                  { status: 'Processing', count: 34, fill: '#3b82f6' },
                  { status: 'Shipped', count: 58, fill: '#8b5cf6' },
                  { status: 'Delivered', count: 123, fill: '#10b981' },
                  { status: 'Cancelled', count: 7, fill: '#ef4444' },
                ]}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(220 72% 47%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
