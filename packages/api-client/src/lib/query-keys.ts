import type { ProductFilters } from '@mcduffcare/ui/types';

/**
 * Centralised TanStack Query key factory.
 * Using a nested object pattern for type-safe, autocomplete-friendly key management.
 */
export const queryKeys = {
  // ── Products ────────────────────────────────────────────────────────────────
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },

  // ── Categories ──────────────────────────────────────────────────────────────
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.categories.all, 'detail', slug] as const,
  },

  // ── Brands ──────────────────────────────────────────────────────────────────
  brands: {
    all: ['brands'] as const,
    list: () => [...queryKeys.brands.all, 'list'] as const,
  },

  // ── Cart ────────────────────────────────────────────────────────────────────
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
  },

  // ── Auth / User ─────────────────────────────────────────────────────────────
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // ── Orders ──────────────────────────────────────────────────────────────────
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (page: number) => [...queryKeys.orders.lists(), { page }] as const,
    detail: (id: number) => [...queryKeys.orders.all, 'detail', id] as const,
  },

  // ── Reviews ──────────────────────────────────────────────────────────────────
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: number) => [...queryKeys.reviews.all, 'product', productId] as const,
  },

  // ── Admin ────────────────────────────────────────────────────────────────────
  admin: {
    dashboard: {
      all: ['admin', 'dashboard'] as const,
      stats: () => [...queryKeys.admin.dashboard.all, 'stats'] as const,
      revenue: (period: string) =>
        [...queryKeys.admin.dashboard.all, 'revenue', period] as const,
      topProducts: () => [...queryKeys.admin.dashboard.all, 'top-products'] as const,
    },
    products: {
      all: ['admin', 'products'] as const,
      list: (filters: ProductFilters) =>
        [...queryKeys.admin.products.all, 'list', { filters }] as const,
      detail: (id: number) => [...queryKeys.admin.products.all, 'detail', id] as const,
    },
    orders: {
      all: ['admin', 'orders'] as const,
      list: (filters: Record<string, unknown>) =>
        [...queryKeys.admin.orders.all, 'list', { filters }] as const,
      detail: (id: number) => [...queryKeys.admin.orders.all, 'detail', id] as const,
    },
    customers: {
      all: ['admin', 'customers'] as const,
      list: (filters: Record<string, unknown>) =>
        [...queryKeys.admin.customers.all, 'list', { filters }] as const,
      detail: (id: number) => [...queryKeys.admin.customers.all, 'detail', id] as const,
    },
  },
} as const;
