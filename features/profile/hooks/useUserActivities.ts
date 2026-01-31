import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { PROFILE_QUERY_KEYS } from '../constants';
import type { Activity, UserActivitiesParams } from '../types';

async function fetchUserActivities({
  userId,
  type,
  limit = 10,
}: UserActivitiesParams): Promise<Activity[]> {
  const now = new Date().toISOString();
  
  let query = supabase
    .from('activity')
    .select('id, user_id, location_id, activity_type, start_time, end_time, created_at, location:location_id(id, name)')
    .eq('user_id', userId)
    .order('start_time', { ascending: type === 'upcoming' })
    .limit(limit);

  if (type === 'upcoming') {
    query = query.gte('start_time', now);
  } else {
    query = query.lt('start_time', now);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  // Transform the data to properly handle location structure
  return (data ?? []).map((activity: any) => ({
    ...activity,
    location: activity.location ? (Array.isArray(activity.location) ? activity.location[0] : activity.location) : null,
  })) as Activity[];
}

export function useUserActivities({
  userId,
  type,
  limit,
}: UserActivitiesParams) {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEYS.ACTIVITIES, userId, type, limit],
    queryFn: () => fetchUserActivities({ userId, type, limit }),
    enabled: !!userId,
  });
}
