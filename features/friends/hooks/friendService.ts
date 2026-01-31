import type { Profile } from '@/features/profile/types';
import { supabase } from '@/lib/supabase';

export async function fetchFriends(userId: string): Promise<Profile[]> {
  const { data: rows, error } = await supabase
    .from('friend')
    .select('requester_id, receiver_id, status')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) throw error;

  const otherUserIds = (rows ?? [])
    .map((row: any) => (row.requester_id === userId ? row.receiver_id : row.requester_id))
    .filter(Boolean);

  if (otherUserIds.length === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profile')
    .select('id, username, title, metric, activity_types, onboarded, created_at, activity_visibility')
    .in('id', otherUserIds);

  if (profileError) throw profileError;
  return (profiles ?? []) as Profile[];
}

export async function fetchPendingRequests(userId: string): Promise<Profile[]> {
  const { data: rows, error } = await supabase
    .from('friend')
    .select('requester_id')
    .eq('receiver_id', userId)
    .eq('status', 'pending');

  if (error) throw error;

  const inboundIds = (rows ?? []).map((r: any) => r.requester_id);
  if (inboundIds.length === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profile')
    .select('id, username, title, metric, activity_types, onboarded, created_at, activity_visibility')
    .in('id', inboundIds);

  if (profileError) throw profileError;
  return (profiles ?? []) as Profile[];
}

export async function fetchFriendStatus(currentUserId: string, targetUserId: string) {
  const { data, error } = await supabase
    .from('friend')
    .select('requester_id, receiver_id, status')
    .or(
      `and(requester_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`
    )
    .maybeSingle();

  if (error) throw error;
  if (!data) return { status: 'none' as const };

  return {
    status: data.status as 'none' | 'pending' | 'accepted' | 'blocked',
    requesterId: data.requester_id,
    receiverId: data.receiver_id,
  };
}

export async function acceptFriendRequest(currentUserId: string, requesterId: string) {
  const { error } = await supabase
    .from('friend')
    .update({ status: 'accepted' })
    .eq('requester_id', requesterId)
    .eq('receiver_id', currentUserId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function rejectFriendRequest(currentUserId: string, requesterId: string) {
  const { error } = await supabase
    .from('friend')
    .delete()
    .eq('requester_id', requesterId)
    .eq('receiver_id', currentUserId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function sendFriendRequest(currentUserId: string, targetUserId: string) {
  const { error } = await supabase.from('friend').insert({
    requester_id: currentUserId,
    receiver_id: targetUserId,
    status: 'pending',
  });

  if (error) throw error;
}

export async function cancelFriendRequest(currentUserId: string, targetUserId: string) {
  const { error } = await supabase
    .from('friend')
    .delete()
    .eq('requester_id', currentUserId)
    .eq('receiver_id', targetUserId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function unfriend(currentUserId: string, targetUserId: string) {
  const { error } = await supabase
    .from('friend')
    .delete()
    .or(
      `and(requester_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`
    )
    .eq('status', 'accepted');

  if (error) throw error;
}
