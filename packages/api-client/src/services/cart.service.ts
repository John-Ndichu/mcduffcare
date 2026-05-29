import type { ApiResponse, Cart } from '@mcduffcare/ui/types';

import { httpClient } from '../lib/http-client';

export interface AddToCartPayload {
  product_id: number;
  variant_id?: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface ApplyCouponPayload {
  coupon_code: string;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    const { data } = await httpClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  async addItem(payload: AddToCartPayload): Promise<Cart> {
    const { data } = await httpClient.post<ApiResponse<Cart>>('/cart/items', payload);
    return data.data;
  },

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<Cart> {
    const { data } = await httpClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, payload);
    return data.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const { data } = await httpClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data.data;
  },

  async clearCart(): Promise<void> {
    await httpClient.delete('/cart');
  },

  async applyCoupon(payload: ApplyCouponPayload): Promise<Cart> {
    const { data } = await httpClient.post<ApiResponse<Cart>>('/cart/coupon', payload);
    return data.data;
  },

  async removeCoupon(): Promise<Cart> {
    const { data } = await httpClient.delete<ApiResponse<Cart>>('/cart/coupon');
    return data.data;
  },
} as const;
