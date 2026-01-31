import { REVIEW_QUERY_KEYS } from '@/features/map';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export interface UserReview {
  id: number;
  user_id: string;
  activity_id: number;
  rating: number;
  description: string;
  created_at: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  location: {
    id: number;
    name: string;
  };
}

async function fetchUserReviews(userId: string, limit: number = 50): Promise<UserReview[]> {
  const { data, error } = await supabase
    .from('review')
    .select('id, user_id, activity_id, rating, description, created_at, activity:activity_id(activity_type, start_time, end_time, location:location_id(id, name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Transform the nested data structure
  return (data ?? []).map((review: any) => ({
    id: review.id,
    user_id: review.user_id,
    activity_id: review.activity_id,
    rating: review.rating,
    description: review.description,
    created_at: review.created_at,
    activity_type: review.activity?.activity_type || 'generic_sports',
    start_time: review.activity?.start_time || review.created_at,
    end_time: review.activity?.end_time || review.created_at,
    location: review.activity?.location || { id: 0, name: 'Unknown Location' },
  })) as UserReview[];
}

export function useUserReviews(userId: string | null, limit: number = 50) {
  return useQuery({
    queryKey: [REVIEW_QUERY_KEYS.REVIEWS, userId, limit],
    queryFn: () => fetchUserReviews(userId ?? '', limit),
    enabled: !!userId,
  });
}
