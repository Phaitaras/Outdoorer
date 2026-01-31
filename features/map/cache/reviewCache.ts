import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, REVIEW_QUERY_KEYS } from '../constants';

export function invalidateReviewQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MAP_USER_PLANS] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MAP_USER_ACTIVITIES] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
  queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.ACTIVITY] });
  queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.REVIEW_DETAIL] });
  queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.REVIEWS] });
  queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.ACTIVITY_REVIEW] });
}
