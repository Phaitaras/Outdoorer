import { PROFILE_QUERY_KEYS } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateActivityParams {
  userId: string;
  activityType: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  startTime: Date;
  endTime: Date;
}

async function createLocationId(location: CreateActivityParams['location']) {
  const { data, error } = await supabase
    .from('location')
    .insert({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as number;
}

async function createActivity({
  userId,
  activityType,
  location,
  startTime,
  endTime,
}: CreateActivityParams): Promise<void> {
  const locationId = await createLocationId(location);

  const { error } = await supabase.from('activity').insert({
    user_id: userId,
    activity_type: activityType,
    location_id: locationId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
  });

  if (error) throw error;
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.USER_ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.USER_PLANS] });
    },
  });
}
