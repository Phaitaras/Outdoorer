import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    unfriend,
} from './friendService';

const invalidateQueries = (queryClient: any, userId: string | null, targetId?: string) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: ['friends', userId] });
    queryClient.invalidateQueries({ queryKey: ['pending-requests', userId] });
    if (targetId) {
      queryClient.invalidateQueries({ queryKey: ['friend-status', userId, targetId] });
    }
  }
};

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
