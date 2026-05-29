import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductCategory,
  ProductBrand,
  ProductFilters,
} from '@mcduffcare/ui/types';

import { httpClient } from '../lib/http-client';

export const productsService = {
  /**
   * Fetch paginated products with optional filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await httpClient.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`,
    );
    return data;
  },

  /**
   * Fetch single product by slug
   */
  async getProduct(slug: string): Promise<Product> {
    const { data } = await httpClient.get<ApiResponse<Product>>(`/products/${slug}`);
    return data.data;
  },

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const { data } = await httpClient.get<ApiResponse<Product[]>>(
      `/products/featured?limit=${limit}`,
    );
    return data.data;
  },

  /**
   * Search products
   */
  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    const { data } = await httpClient.get<ApiResponse<Product[]>>(
      `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return data.data;
  },

  /**
   * Fetch all categories (tree structure)
   */
  async getCategories(): Promise<ProductCategory[]> {
    const { data } = await httpClient.get<ApiResponse<ProductCategory[]>>('/categories');
    return data.data;
  },

  /**
   * Fetch single category with products
   */
  async getCategory(slug: string): Promise<ProductCategory> {
    const { data } = await httpClient.get<ApiResponse<ProductCategory>>(`/categories/${slug}`);
    return data.data;
  },

  /**
   * Fetch all brands
   */
  async getBrands(): Promise<ProductBrand[]> {
    const { data } = await httpClient.get<ApiResponse<ProductBrand[]>>('/brands');
    return data.data;
  },
} as const;
