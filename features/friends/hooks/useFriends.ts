import type { Profile } from '@/features/profile/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface FriendRow {
  id: number;
  requester_id: string;
  receiver_id: string;
  status: string;
}

async function fetchFriends(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('friend')
    .select('id, requester_id, receiver_id, status')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) throw error;
  const rows = (data ?? []) as FriendRow[];
  const otherUserIds = rows
    .map((row) => (row.requester_id === userId ? row.receiver_id : row.requester_id))
    .filter(Boolean);

  if (otherUserIds.length === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profile')
    .select('id, username, title, metric, activity_types, onboarded, created_at')
    .in('id', otherUserIds);

  if (profileError) throw profileError;
  return (profiles ?? []) as Profile[];
}

export function useFriends(userId: string | null) {
  return useQuery({
    queryKey: ['friends', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchFriends(userId);
    },
    enabled: !!userId,
  });
}
