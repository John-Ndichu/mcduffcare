import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  DashboardStats,
  Order,
  PaginatedResponse,
  Product,
  ProductFilters,
  RevenueDataPoint,
  TopProduct,
  User,
} from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { adminService } from '../services/admin.service';

// ─── Dashboard stats ───────────────────────────────────────────────────────────
export function useDashboardStats(
  options?: Omit<UseQueryOptions<DashboardStats>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.stats(),
    queryFn: adminService.getDashboardStats,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useRevenueData(
  period: 'week' | 'month' | 'year' = 'month',
  options?: Omit<UseQueryOptions<RevenueDataPoint[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.revenue(period),
    queryFn: () => adminService.getRevenueData(period),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useTopProducts(
  limit = 5,
  options?: Omit<UseQueryOptions<TopProduct[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.topProducts(),
    queryFn: () => adminService.getTopProducts(limit),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

// ─── Admin products ────────────────────────────────────────────────────────────
export function useAdminProducts(
  filters: ProductFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<Product>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.products.list(filters),
    queryFn: () => adminService.getProducts(filters),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useAdminProduct(
  id: number,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.products.detail(id),
    queryFn: () => adminService.getProduct(id),
    enabled: id > 0,
    ...options,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => adminService.createProduct(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      toast.success('Product created successfully.');
    },
    onError: () => {
      toast.error('Failed to create product. Please try again.');
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Product> & { id: number }) =>
      adminService.updateProduct(id, payload),
    onSuccess: (product) => {
      qc.setQueryData(queryKeys.admin.products.detail(product.id), product);
      void qc.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      toast.success('Product updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update product.');
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.products.all });
      toast.success('Product deleted.');
    },
    onError: () => {
      toast.error('Failed to delete product.');
    },
  });
}

// ─── Admin orders ──────────────────────────────────────────────────────────────
export function useAdminOrders(
  filters: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Order>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.orders.list(filters),
    queryFn: () => adminService.getOrders(filters),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: (order) => {
      qc.setQueryData(queryKeys.admin.orders.detail(order.id), order);
      void qc.invalidateQueries({ queryKey: queryKeys.admin.orders.all });
      toast.success('Order status updated.');
    },
  });
}

// ─── Admin customers ───────────────────────────────────────────────────────────
export function useAdminCustomers(
  filters: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<User>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.admin.customers.list(filters),
    queryFn: () => adminService.getCustomers(filters),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
