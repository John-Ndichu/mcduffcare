import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Order, PaginatedResponse } from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { ordersService, type CreateOrderPayload } from '../services/orders.service';

export function useOrders(
  page = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Order>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.orders.list(page),
    queryFn: () => ordersService.getOrders(page),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useOrder(
  id: number,
  options?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.createOrder(payload),
    onSuccess: (order) => {
      void qc.invalidateQueries({ queryKey: queryKeys.orders.all });
      void qc.invalidateQueries({ queryKey: queryKeys.cart.current() });
      toast.success(`Order #${order.order_number} placed successfully!`);
    },
    onError: () => {
      toast.error('Failed to place order. Please try again.');
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersService.cancelOrder(id),
    onSuccess: (order) => {
      qc.setQueryData(queryKeys.orders.detail(order.id), order);
      void qc.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      toast.success('Order cancelled.');
    },
    onError: () => {
      toast.error('Failed to cancel order.');
    },
  });
}

export function useInitiateMpesaPay() {
  return useMutation({
    mutationFn: ({ orderId, phone }: { orderId: number; phone: string }) =>
      ordersService.inititateMpesaPay({ order_id: orderId, phone_number: phone }),
    onError: () => {
      toast.error('M-Pesa payment request failed. Please try again.');
    },
  });
}
