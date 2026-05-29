import type {
  ApiResponse,
  DashboardStats,
  Order,
  PaginatedResponse,
  Product,
  RevenueDataPoint,
  TopProduct,
  User,
} from '@mcduffcare/ui/types';

import { httpClient } from '../lib/http-client';
import type { ProductFilters } from '@mcduffcare/ui/types';

export const adminService = {
  // ── Dashboard ────────────────────────────────────────────────────────────────
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await httpClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return data.data;
  },

  async getRevenueData(period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueDataPoint[]> {
    const { data } = await httpClient.get<ApiResponse<RevenueDataPoint[]>>(
      `/admin/dashboard/revenue?period=${period}`,
    );
    return data.data;
  },

  async getTopProducts(limit = 5): Promise<TopProduct[]> {
    const { data } = await httpClient.get<ApiResponse<TopProduct[]>>(
      `/admin/dashboard/top-products?limit=${limit}`,
    );
    return data.data;
  },

  // ── Products ─────────────────────────────────────────────────────────────────
  async getProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
    const { data } = await httpClient.get<PaginatedResponse<Product>>(
      `/admin/products?${params.toString()}`,
    );
    return data;
  },

  async getProduct(id: number): Promise<Product> {
    const { data } = await httpClient.get<ApiResponse<Product>>(`/admin/products/${id}`);
    return data.data;
  },

  async createProduct(payload: Partial<Product>): Promise<Product> {
    const { data } = await httpClient.post<ApiResponse<Product>>('/admin/products', payload);
    return data.data;
  },

  async updateProduct(id: number, payload: Partial<Product>): Promise<Product> {
    const { data } = await httpClient.put<ApiResponse<Product>>(`/admin/products/${id}`, payload);
    return data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await httpClient.delete(`/admin/products/${id}`);
  },

  // ── Orders ───────────────────────────────────────────────────────────────────
  async getOrders(
    filters: Record<string, unknown> = {},
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
    const { data } = await httpClient.get<PaginatedResponse<Order>>(
      `/admin/orders?${params.toString()}`,
    );
    return data;
  },

  async getOrder(id: number): Promise<Order> {
    const { data } = await httpClient.get<ApiResponse<Order>>(`/admin/orders/${id}`);
    return data.data;
  },

  async updateOrderStatus(
    id: number,
    status: string,
  ): Promise<Order> {
    const { data } = await httpClient.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
      status,
    });
    return data.data;
  },

  // ── Customers ────────────────────────────────────────────────────────────────
  async getCustomers(
    filters: Record<string, unknown> = {},
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
    const { data } = await httpClient.get<PaginatedResponse<User>>(
      `/admin/customers?${params.toString()}`,
    );
    return data;
  },

  async getCustomer(id: number): Promise<User> {
    const { data } = await httpClient.get<ApiResponse<User>>(`/admin/customers/${id}`);
    return data.data;
  },
} as const;
