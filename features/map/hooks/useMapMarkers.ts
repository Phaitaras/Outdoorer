import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants';

export type MarkerType = 'plan' | 'activity' | 'friend';
export type MapMarker = {
  latitude: number;
  longitude: number;
  title?: string | null;
  type: MarkerType;
  activity: Activity;
};

type Activity = {
  id: string;
  user_id: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  location_id: string;
  location: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  } | {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];
  review?: {
    id: string;
    rating: number;
    description: string;
  }[];
};

export function useUserPlans(userId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.MAP_USER_PLANS, userId],
    enabled: !!userId,
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('activity')
        .select('id, user_id, activity_type, start_time, end_time, location_id, location:location_id(id, name, latitude, longitude), review(id, rating, description)')
        .eq('user_id', userId)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(50);

      if (error) throw error;
      return (data ?? []) as Activity[];
    },
  });
}

export function useUserActivities(userId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.MAP_USER_ACTIVITIES, userId],
    enabled: !!userId,
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('activity')
        .select('id, user_id, activity_type, start_time, end_time, location_id, location:location_id(id, name, latitude, longitude), review(id, rating, description)')
        .eq('user_id', userId)
        .lt('start_time', now)
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data ?? []) as Activity[];
    },
  });
}

export function useFriendActivities(friendIds: string[]) {
  return useQuery({
    queryKey: [QUERY_KEYS.MAP_FRIEND_ACTIVITIES, friendIds],
    enabled: friendIds.length > 0,
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('activity')
        .select('id, user_id, activity_type, start_time, end_time, location_id, location:location_id(id, name, latitude, longitude), review(id, rating, description)')
        .in('user_id', friendIds)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return (data ?? []) as Activity[];
    },
  });
}

export function toMarker(item: Activity | any, type: MarkerType): MapMarker | null {
  let loc = item.location;
  
  if (Array.isArray(loc) && loc.length > 0) {
    loc = loc[0];
  }
  
  if (!loc || loc.latitude == null || loc.longitude == null) return null;
  return {
    latitude: Number(loc.latitude),
    longitude: Number(loc.longitude),
    title: loc.name,
    type,
    activity: item,
  };
}
