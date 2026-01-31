import { useQuery } from '@tanstack/react-query';
import { FRIENDS_QUERY_KEYS } from '../constants';
import { fetchPendingRequests } from './friendService';

export function usePendingRequests(userId: string | null) {
  return useQuery({
    queryKey: [FRIENDS_QUERY_KEYS.PENDING_REQUESTS, userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchPendingRequests(userId);
    },
    enabled: !!userId,
  });
}
