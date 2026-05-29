import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import type { PaginatedResponse, Review } from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { reviewsService, type CreateReviewPayload } from '../services/reviews.service';

export function useProductReviews(
  productId: number,
  page = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Review>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => reviewsService.getProductReviews(productId, page),
    enabled: productId > 0,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsService.createReview(payload),
    onSuccess: (review) => {
      void qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(review.product_id) });
      void qc.invalidateQueries({ queryKey: queryKeys.products.detail('') }); // refresh rating
      toast.success('Review submitted! Thank you for your feedback.');
    },
    onError: () => {
      toast.error('Failed to submit review. Please try again.');
    },
  });
}
