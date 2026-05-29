import type { ApiResponse, Order, PaginatedResponse, PaymentMethod } from '@mcduffcare/ui/types';

import { httpClient } from '../lib/http-client';

export interface CreateOrderPayload {
  shipping_address_id: number;
  payment_method: PaymentMethod;
  notes?: string;
  coupon_code?: string;
}

export interface MpesaPayPayload {
  order_id: number;
  phone_number: string;
}

export const ordersService = {
  async getOrders(page = 1, per_page = 10): Promise<PaginatedResponse<Order>> {
    const { data } = await httpClient.get<PaginatedResponse<Order>>(
      `/orders?page=${page}&per_page=${per_page}`,
    );
    return data;
  },

  async getOrder(id: number): Promise<Order> {
    const { data } = await httpClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await httpClient.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const { data } = await httpClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },

  async inititateMpesaPay(payload: MpesaPayPayload): Promise<{ checkout_request_id: string }> {
    const { data } = await httpClient.post<ApiResponse<{ checkout_request_id: string }>>(
      '/payments/mpesa/stkpush',
      payload,
    );
    return data.data;
  },

  async checkMpesaStatus(checkoutRequestId: string): Promise<{ status: string; message: string }> {
    const { data } = await httpClient.get<ApiResponse<{ status: string; message: string }>>(
      `/payments/mpesa/status/${checkoutRequestId}`,
    );
    return data.data;
  },
} as const;
