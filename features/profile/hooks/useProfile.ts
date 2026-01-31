import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { PROFILE_QUERY_KEYS } from '../constants';
import type { ProfileWithStats } from '../types';

async function fetchProfile(userId: string): Promise<ProfileWithStats> {
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('id, username, title, metric, activity_types, onboarded, created_at, activity_visibility')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;
  if (!profile) throw new Error('Profile not found');

  const { count: friendCount, error: friendError } = await supabase
    .from('friend')
    .select('*', { count: 'exact', head: true })
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (friendError) throw friendError;

  const now = new Date().toISOString();

  const { count: activityCount, error: activityError } = await supabase
    .from('activity')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lt('start_time', now);

  if (activityError) throw activityError;

  const { count: reviewCount, error: reviewError } = await supabase
    .from('review')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (reviewError) throw reviewError;

  return {
    ...profile,
    activity_visibility: profile.activity_visibility ?? 'friends',
    friendCount: friendCount ?? 0,
    activityCount: activityCount ?? 0,
    reviewCount: reviewCount ?? 0,
  } as ProfileWithStats;
}

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEYS.PROFILE, userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchProfile(userId);
    },
    enabled: !!userId,
  });
}
