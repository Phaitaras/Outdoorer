import { REVIEW_QUERY_KEYS } from '@/features/map';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import type { ReviewDetail } from '../types';

async function fetchUserReviewDetail(reviewId: number): Promise<ReviewDetail> {
  const { data, error } = await supabase
    .from('review')
    .select(
      'id, user_id, activity_id, rating, description, created_at, activity:activity_id(id, user_id, activity_type, start_time, end_time, location:location_id(id, name))'
    )
    .eq('id', reviewId)
    .single();

  if (error) throw error;

  const activity = Array.isArray(data?.activity) ? data.activity[0] : data?.activity ?? null;
  const location = activity?.location
    ? Array.isArray(activity.location)
      ? activity.location[0]
      : activity.location
    : null;

  return {
    id: data.id,
    user_id: data.user_id,
    activity_id: data.activity_id,
    rating: data.rating,
    description: data.description,
    created_at: data.created_at,
    activity: activity
      ? {
          ...activity,
          location,
        }
      : null,
  } as ReviewDetail;
}

export function useUserReviewDetail(reviewId: number | null) {
  return useQuery({
    queryKey: [REVIEW_QUERY_KEYS.REVIEW_DETAIL, reviewId],
    queryFn: () => fetchUserReviewDetail(reviewId as number),
    enabled: !!reviewId,
  });
}
