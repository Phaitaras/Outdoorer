import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateReviewQueries } from '../cache/reviewCache';

export interface ReviewInput {
  activityId: string | number;
  userId: string;
  rating: number;
  description: string;
}

export interface ReviewUpdate {
  reviewId: string | number;
  rating: number;
  description: string;
}

async function createReview(input: ReviewInput) {
  const { data, error } = await supabase
    .from('review')
    .insert({
      activity_id: input.activityId,
      user_id: input.userId,
      rating: input.rating,
      description: input.description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateReview(input: ReviewUpdate) {
  const { data, error } = await supabase
    .from('review')
    .update({
      rating: input.rating,
      description: input.description,
    })
    .eq('id', input.reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      invalidateReviewQueries(queryClient);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      invalidateReviewQueries(queryClient);
    },
  });
}

async function deleteReview(reviewId: string | number) {
  const { error } = await supabase
    .from('review')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      invalidateReviewQueries(queryClient);
    },
  });
}
