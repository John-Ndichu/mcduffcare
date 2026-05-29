import type { ApiResponse, PaginatedResponse, Review } from '@mcduffcare/ui/types';

import { httpClient } from '../lib/http-client';

export interface CreateReviewPayload {
  product_id: number;
  rating: number;
  title: string;
  body: string;
}

export const reviewsService = {
  async getProductReviews(productId: number, page = 1): Promise<PaginatedResponse<Review>> {
    const { data } = await httpClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews?page=${page}`,
    );
    return data;
  },

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await httpClient.post<ApiResponse<Review>>('/reviews', payload);
    return data.data;
  },

  async markHelpful(reviewId: number): Promise<void> {
    await httpClient.post(`/reviews/${reviewId}/helpful`);
  },
} as const;
