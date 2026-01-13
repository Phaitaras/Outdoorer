import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import type { Activity, UserActivitiesParams } from '../types';

async function fetchUserActivities({
  userId,
  type,
  limit = 10,
}: UserActivitiesParams): Promise<Activity[]> {
  const now = new Date().toISOString();
  
  let query = supabase
    .from('activity')
    .select('id, user_id, location_id, activity_type, start_time, end_time, created_at')
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
  return (data ?? []) as Activity[];
}

export function useUserActivities({
  userId,
  type,
  limit,
}: UserActivitiesParams) {
  return useQuery({
    queryKey: ['activities', userId, type, limit],
    queryFn: () => fetchUserActivities({ userId, type, limit }),
    enabled: !!userId,
  });
}
