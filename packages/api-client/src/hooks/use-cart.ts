import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Cart } from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { cartService, type AddToCartPayload } from '../services/cart.service';

// ─── Get cart ──────────────────────────────────────────────────────────────────
export function useCart(options?: Omit<UseQueryOptions<Cart>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 2, // cart is fairly volatile
    ...options,
  });
}

// ─── Add to cart ───────────────────────────────────────────────────────────────
export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addItem(payload),
    onSuccess: (cart) => {
      qc.setQueryData(queryKeys.cart.current(), cart);
      toast.success('Added to cart!');
    },
    onError: () => {
      toast.error('Failed to add item to cart. Please try again.');
    },
  });
}

// ─── Update cart item ──────────────────────────────────────────────────────────
export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, { quantity }),
    // Optimistic update
    onMutate: async ({ itemId, quantity }) => {
      await qc.cancelQueries({ queryKey: queryKeys.cart.current() });
      const prev = qc.getQueryData<Cart>(queryKeys.cart.current());
      qc.setQueryData<Cart>(queryKeys.cart.current(), (old) => {
        if (old === undefined) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity, subtotal: item.price * quantity }
              : item,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        qc.setQueryData(queryKeys.cart.current(), ctx.prev);
      }
      toast.error('Failed to update cart.');
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

// ─── Remove cart item ──────────────────────────────────────────────────────────
export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onMutate: async (itemId) => {
      await qc.cancelQueries({ queryKey: queryKeys.cart.current() });
      const prev = qc.getQueryData<Cart>(queryKeys.cart.current());
      qc.setQueryData<Cart>(queryKeys.cart.current(), (old) => {
        if (old === undefined) return old;
        return { ...old, items: old.items.filter((item) => item.id !== itemId) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        qc.setQueryData(queryKeys.cart.current(), ctx.prev);
      }
      toast.error('Failed to remove item.');
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
    onSuccess: () => {
      toast.success('Item removed from cart.');
    },
  });
}

// ─── Apply coupon ──────────────────────────────────────────────────────────────
export function useApplyCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coupon_code: string) => cartService.applyCoupon({ coupon_code }),
    onSuccess: (cart) => {
      qc.setQueryData(queryKeys.cart.current(), cart);
      toast.success('Coupon applied!');
    },
    onError: () => {
      toast.error('Invalid or expired coupon code.');
    },
  });
}

// ─── Remove coupon ─────────────────────────────────────────────────────────────
export function useRemoveCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartService.removeCoupon,
    onSuccess: (cart) => {
      qc.setQueryData(queryKeys.cart.current(), cart);
      toast.success('Coupon removed.');
    },
  });
}
