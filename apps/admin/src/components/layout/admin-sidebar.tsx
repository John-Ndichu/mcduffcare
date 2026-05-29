'use client';

import * as React from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Pill,
  LogOut,
  Tag,
  Truck,
} from 'lucide-react';

import { ScrollArea } from '@mcduffcare/ui/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@mcduffcare/ui/components/ui/tooltip';
import { cn } from '@mcduffcare/ui/lib/utils';
import { useLogout } from '@mcduffcare/api-client/hooks/use-auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
  { label: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
] as const;

const bottomItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

export function AdminSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const { mutate: logout } = useLogout();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative flex flex-col border-r bg-brand-navy transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Logo */}
        <div className={cn('flex h-16 items-center border-b border-white/10 px-4', collapsed && 'justify-center px-0')}>
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-royal">
              <span className="font-heading text-xs font-bold text-white">MC</span>
            </div>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-royal">
                <span className="font-heading text-xs font-bold text-white">MC</span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-white leading-none">McDuffCare</p>
                <p className="text-xs text-white/50">Admin Portal</p>
              </div>
            </Link>
          )}
        </div>

        <button
          onClick={() => setCollapsed((p) => !p)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-heading font-medium transition-colors',
                        isActive
                          ? 'bg-brand-royal text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white',
                        collapsed && 'justify-center px-2',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {!collapsed && <span>{label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{label}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-2 space-y-0.5 border-t border-white/10">
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-heading font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors',
                    collapsed && 'justify-center px-2',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => logout()}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-heading font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors',
                  collapsed && 'justify-center px-2',
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
