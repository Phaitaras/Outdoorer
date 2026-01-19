import { useQuery } from '@tanstack/react-query';
import { fetchFriends } from './friendService';

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
