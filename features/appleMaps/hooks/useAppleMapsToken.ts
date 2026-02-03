import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface AppleMapsTokenResponse {
  token: string;
  expiresIn: number;
  expiresAt: number;
}

async function fetchAppleMapsToken(): Promise<AppleMapsTokenResponse> {
  const { data, error } = await supabase.functions.invoke('get-apple-maps-token');

  if (error) {
    throw new Error(error.message || 'Failed to fetch Apple Maps token');
  }

  if (!data?.token) {
    throw new Error('No token returned from server');
  }

  return data as AppleMapsTokenResponse;
}

export const APPLE_MAPS_QUERY_KEYS = {
  TOKEN: 'appleMapsToken',
} as const;

/**
 * Hook to fetch and cache Apple Maps API token.
 * 
 * Uses TanStack Query for caching with:
 * - 25 minute stale time (tokens valid for 30 min)
 * - 28 minute cache time
 * - No refetch on window focus (token doesn't change)
 * - Auto-refetch when stale
 */
export function useAppleMapsToken() {
  return useQuery({
    queryKey: [APPLE_MAPS_QUERY_KEYS.TOKEN],
    queryFn: fetchAppleMapsToken,
    staleTime: 25 * 60 * 1000, // 25 minutes
    gcTime: 28 * 60 * 1000, // 28 minutes (garbage collection time)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    select: (data) => data.token, // Return just the token string
  });
}

/**
 * Hook to get full token data including expiry info.
 * Useful for debugging or showing token status.
 */
export function useAppleMapsTokenData() {
  return useQuery({
    queryKey: [APPLE_MAPS_QUERY_KEYS.TOKEN],
    queryFn: fetchAppleMapsToken,
    staleTime: 25 * 60 * 1000,
    gcTime: 28 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
}
