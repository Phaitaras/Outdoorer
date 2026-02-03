import { REVIEW_QUERY_KEYS } from '@/features/map';
import type { Activity } from '@/features/profile/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface ActivityWithReview extends Activity {
  hasReview: boolean;
  reviewId?: number | null;
}

async function fetchActivityById(activityId: number): Promise<ActivityWithReview | null> {
  const { data, error } = await supabase
    .from('activity')
    .select('id, user_id, location_id, activity_type, start_time, end_time, created_at, location:location_id(id, name, latitude, longitude)')
    .eq('id', activityId)
    .single();

  if (error) {
    console.error('Error fetching activity by ID:', error);
    return null;
  }

  // Transform location from array to single object if needed
  const location = data?.location
    ? Array.isArray(data.location)
      ? data.location[0]
      : data.location
    : null;

  const { data: review } = await supabase
    .from('review')
    .select('id')
    .eq('activity_id', activityId)
    .limit(1);

  return {
    ...data,
    location,
    hasReview: review ? review.length > 0 : false,
    reviewId: review && review.length > 0 ? review[0].id : null,
  } as ActivityWithReview;
}

export function useActivityById(activityId: number | null) {
  return useQuery({
    queryKey: [REVIEW_QUERY_KEYS.ACTIVITY, activityId],
    queryFn: () => fetchActivityById(activityId!),
    enabled: !!activityId,
  });
}
