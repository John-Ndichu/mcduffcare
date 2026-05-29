import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';

import type { PaginatedResponse, Product, ProductCategory, ProductBrand, ProductFilters } from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { productsService } from '../services/products.service';

export function useProducts(
  filters: ProductFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Product>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

type ProductsPage = PaginatedResponse<Product>;

export function useInfiniteProducts(filters: Omit<ProductFilters, 'page'> = {}) {
  return useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage>,
    ReturnType<typeof queryKeys.products.list>,
    number
  >({
    queryKey: queryKeys.products.list({ ...filters, page: 0 }),

    queryFn: ({ pageParam }) =>
      productsService.getProducts({
        ...filters,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });
}

// ─── Single product ────────────────────────────────────────────────────────────
export function useProduct(
  slug: string,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productsService.getProduct(slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: slug.length > 0,
    ...options,
  });
}

// ─── Featured products ─────────────────────────────────────────────────────────
export function useFeaturedProducts(
  limit = 8,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productsService.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

// ─── Product search ────────────────────────────────────────────────────────────
export function useProductSearch(
  query: string,
  limit = 10,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productsService.searchProducts(query, limit),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

// ─── Categories ────────────────────────────────────────────────────────────────
export function useCategories(
  options?: Omit<UseQueryOptions<ProductCategory[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: productsService.getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

export function useCategory(
  slug: string,
  options?: Omit<UseQueryOptions<ProductCategory>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => productsService.getCategory(slug),
    enabled: slug.length > 0,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}

// ─── Brands ────────────────────────────────────────────────────────────────────
export function useBrands(
  options?: Omit<UseQueryOptions<ProductBrand[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: productsService.getBrands,
    staleTime: 1000 * 60 * 60,
    ...options,
  });
}
