'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@mcduffcare/ui/components/ui/tabs';

import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn, formatPrice, formatNumber } from '@mcduffcare/ui/lib/utils';

import { useDashboardStats, useRevenueData, useTopProducts } from '@mcduffcare/api-client/hooks/use-admin';

type Period = 'week' | 'month' | 'year';

// const CHART_COLORS = ['#1A3FA8', '#C8102E', '#10b981', '#f59e0b', '#8b5cf6'];

const CATEGORY_DATA = [
  { name: 'OTC Medicine', value: 35, color: '#1A3FA8' },
  { name: 'Supplements', value: 25, color: '#2E7CF6' },
  { name: 'Skincare', value: 18, color: '#10b981' },
  { name: 'Prescription', value: 14, color: '#C8102E' },
  { name: 'Devices', value: 8, color: '#f59e0b' },
];

export default function AdminAnalyticsPage(): React.JSX.Element {
  const [period, setPeriod] = React.useState<Period>('month');

  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: revenue, isLoading: loadingRevenue } = useRevenueData(period);
  const { data: topProducts } = useTopProducts(10);

  const kpiCards = stats !== undefined
    ? [
        { title: 'Total Revenue', value: formatPrice(stats.total_revenue), change: stats.revenue_change, icon: DollarSign, color: 'text-brand-royal bg-brand-light-blue' },
        { title: 'Total Orders', value: formatNumber(stats.total_orders), change: stats.orders_change, icon: ShoppingBag, color: 'text-emerald-700 bg-emerald-50' },
        { title: 'Customers', value: formatNumber(stats.total_customers), change: stats.customers_change, icon: Users, color: 'text-purple-700 bg-purple-50' },
        { title: 'Avg Order Value', value: formatPrice(stats.average_order_value), change: stats.aov_change, icon: Package, color: 'text-amber-700 bg-amber-50' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">In-depth business performance insights</p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="week">7 Days</TabsTrigger>
            <TabsTrigger value="month">30 Days</TabsTrigger>
            <TabsTrigger value="year">12 Months</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : kpiCards.map(({ title, value, change, icon: Icon, color }) => (
              <Card key={title} className="hover:shadow-card-hover transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="text-xs font-medium">{title}</CardDescription>
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-xl font-bold">{value}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {change >= 0
                      ? <TrendingUp className="h-3 w-3 text-emerald-600" />
                      : <TrendingDown className="h-3 w-3 text-destructive" />}
                    <span className={cn('text-xs font-medium', change >= 0 ? 'text-emerald-600' : 'text-destructive')}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Revenue + Orders area chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders Over Time</CardTitle>
          <CardDescription>Trends for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRevenue
            ? <Skeleton className="h-72 w-full" />
            : (
              <ResponsiveContainer width="100%" height={288}>
                <AreaChart data={revenue ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3FA8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1A3FA8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8102E" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
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
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="rev"
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                  />
                  <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
                  <Tooltip
                    formatter={(v: number, name: string) =>
                      name === 'revenue' ? [formatPrice(v), 'Revenue'] : [formatNumber(v), 'Orders']
                    }
                    labelFormatter={(l: string) => format(parseISO(l), 'dd MMM yyyy')}
                  />
                  <Legend />
                  <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#1A3FA8" strokeWidth={2} fill="url(#revGrad)" dot={false} name="revenue" />
                  <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#C8102E" strokeWidth={2} fill="url(#orderGrad)" dot={false} name="orders" />
                </AreaChart>
              </ResponsiveContainer>
            )}
        </CardContent>
      </Card>

      {/* Bottom row: Category pie + Top products bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales by category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue share per product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {CATEGORY_DATA.map((entry, _index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {CATEGORY_DATA.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </div>
                    <span className="text-xs font-semibold font-heading">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top products by revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>Best performing products this {period}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={(topProducts ?? []).slice(0, 6).map((tp) => ({
                  name: tp.product.name.length > 20 ? `${tp.product.name.slice(0, 20)}…` : tp.product.name,
                  revenue: tp.total_revenue,
                  sold: tp.total_sold,
                }))}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                <XAxis type="number" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#1A3FA8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily orders line chart */}
      <Card>
        <CardHeader>
          <CardTitle>Order Velocity</CardTitle>
          <CardDescription>Number of orders placed per day</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRevenue
            ? <Skeleton className="h-56 w-full" />
            : (
              <ResponsiveContainer width="100%" height={224}>
                <LineChart data={revenue ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) =>
                      period === 'year' ? format(parseISO(d), 'MMM') : format(parseISO(d), 'd')
                    }
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip labelFormatter={(l: string) => format(parseISO(l), 'dd MMM yyyy')} />
                  <Line type="monotone" dataKey="orders" stroke="#1A4BDB" strokeWidth={2} dot={{ r: 3, fill: '#1A4BDB' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
