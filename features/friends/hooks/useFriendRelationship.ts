import { PROFILE_QUERY_KEYS } from '@/features/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FRIENDS_QUERY_KEYS } from '../constants';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  fetchFriendStatus,
  rejectFriendRequest,
  sendFriendRequest,
  unfriend,
} from './friendService';

const invalidateQueries = (queryClient: any, userId: string | null, targetId?: string) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.PROFILE, userId] });
    queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEYS.FRIENDS, userId] });
    queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEYS.PENDING_REQUESTS, userId] });
    if (targetId) {
      queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEYS.FRIEND_STATUS, userId, targetId] });
    }
  }
};

export function useFriendStatus(currentUserId: string | null, targetUserId: string | null) {
  return useQuery({
    queryKey: [FRIENDS_QUERY_KEYS.FRIEND_STATUS, currentUserId, targetUserId],
    queryFn: () => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs are required');
      return fetchFriendStatus(currentUserId, targetUserId);
    },
    enabled: !!currentUserId && !!targetUserId,
  });
}

export function useAcceptFriendRequest(currentUserId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requesterId: string) => {
      if (!currentUserId || !requesterId) throw new Error('User IDs are required');
      return acceptFriendRequest(currentUserId, requesterId);
    },
    onSuccess: (_, requesterId) => invalidateQueries(queryClient, currentUserId, requesterId),
  });
}

export function useRejectFriendRequest(currentUserId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requesterId: string) => {
      if (!currentUserId || !requesterId) throw new Error('User IDs are required');
      return rejectFriendRequest(currentUserId, requesterId);
    },
    onSuccess: (_, requesterId) => invalidateQueries(queryClient, currentUserId, requesterId),
  });
}

export function useSendFriendRequest(currentUserId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs are required');
      return sendFriendRequest(currentUserId, targetUserId);
    },
    onSuccess: (_, targetUserId) => invalidateQueries(queryClient, currentUserId, targetUserId),
  });
}

export function useCancelFriendRequest(currentUserId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs are required');
      return cancelFriendRequest(currentUserId, targetUserId);
    },
    onSuccess: (_, targetUserId) => invalidateQueries(queryClient, currentUserId, targetUserId),
  });
}

export function useUnfriend(currentUserId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs are required');
      return unfriend(currentUserId, targetUserId);
    },
    onSuccess: (_, targetUserId) => invalidateQueries(queryClient, currentUserId, targetUserId),
  });
}

export function useFriendActions(currentUserId: string | null, targetUserId: string | null) {
  const request = useSendFriendRequest(currentUserId);
  const cancel = useCancelFriendRequest(currentUserId);
  const accept = useAcceptFriendRequest(currentUserId);
  const unfriendMutation = useUnfriend(currentUserId);

  return {
    request: {
      ...request,
      mutate: () => targetUserId && request.mutate(targetUserId),
    },
    cancel: {
      ...cancel,
      mutate: () => targetUserId && cancel.mutate(targetUserId),
    },
    accept: {
      ...accept,
      mutate: () => targetUserId && accept.mutate(targetUserId),
    },
    unfriend: {
      ...unfriendMutation,
      mutate: () => targetUserId && unfriendMutation.mutate(targetUserId),
    },
  };
}
