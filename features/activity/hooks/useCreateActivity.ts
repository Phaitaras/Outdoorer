import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateActivityParams {
  userId: string;
  activityType: string;
  locationId: number | null;
  startTime: Date;
  endTime: Date;
}

async function createActivity({
  userId,
  activityType,
  locationId,
  startTime,
  endTime,
}: CreateActivityParams): Promise<void> {
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
