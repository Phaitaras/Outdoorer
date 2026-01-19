import type { Activity } from '@/features/profile/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

async function fetchFriendActivities(userId: string, limit = 5): Promise<Activity[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('activity')
    .select('id, user_id, location_id, activity_type, start_time, end_time, created_at')
    .eq('user_id', userId)
    .lt('start_time', now)
    .order('start_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Activity[];
}

export function useFriendActivities(userId: string | null, enabled: boolean, limit = 5) {
  return useQuery({
    queryKey: ['friend-activities', userId, limit],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchFriendActivities(userId, limit);
    },
    enabled: enabled && !!userId,
  });
}
