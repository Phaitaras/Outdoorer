import { useQuery } from '@tanstack/react-query';
import { FRIENDS_QUERY_KEYS } from '../constants';
import { fetchFriends } from './friendService';

export function useFriends(userId: string | null) {
  return useQuery({
    queryKey: [FRIENDS_QUERY_KEYS.FRIENDS, userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return fetchFriends(userId);
    },
    enabled: !!userId,
  });
}
