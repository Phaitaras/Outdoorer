import { useQuery } from '@tanstack/react-query';
import { fetchPendingRequests } from './friendService';

export function usePendingRequests(userId: string | null) {
  return useQuery({
    queryKey: ['pending-requests', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchPendingRequests(userId);
    },
    enabled: !!userId,
  });
}
