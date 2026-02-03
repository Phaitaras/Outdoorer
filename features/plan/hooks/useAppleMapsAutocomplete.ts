import { APPLE_MAPS_QUERY_KEYS, useAppleMapsToken } from '@/features/appleMaps';
import { AutocompleteResult } from '@/features/plan/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

export const LOCATION_PICKER_QUERY_KEYS = {
  AUTOCOMPLETE: 'appleMapsAutocomplete',
  GEOCODE: 'appleMapsGeocode',
} as const;

interface AutocompleteResponse {
  results: Array<{
    completionUrl: string;
    displayLines: string[];
    location?: {
      latitude: number;
      longitude: number;
    };
    structuredAddress?: {
      locality?: string;
      postCode?: string;
      country?: string;
      countryCode?: string;
    };
  }>;
}

async function fetchAutocomplete(
  query: string,
  token: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<AutocompleteResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    lang: 'en-GB',
    resultTypeFilter: 'Address,Poi',
  });

  if (userLocation) {
    params.append('searchLocation', `${userLocation.latitude},${userLocation.longitude}`);
  }

  const response = await fetch(
    `https://maps-api.apple.com/v1/searchAutocomplete?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apple Maps API error (${response.status}): ${errorText}`);
  }

  const data: AutocompleteResponse = await response.json();
  return data.results || [];
}

export function useAppleMapsAutocomplete(userLocation?: { latitude: number; longitude: number }) {
  const { data: token } = useAppleMapsToken();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // debounce the search query to avoid too many API calls
  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
    }, 300),
    []
  );

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSetQuery(query);
  }, [debouncedSetQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const { data: results = [], isLoading, error } = useQuery({
    queryKey: [LOCATION_PICKER_QUERY_KEYS.AUTOCOMPLETE, debouncedQuery, userLocation?.latitude, userLocation?.longitude],
    queryFn: () => fetchAutocomplete(debouncedQuery, token!, userLocation),
    enabled: !!token && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // On 401, invalidate token and retry
      if (error instanceof Error && error.message.includes('(401)')) {
        if (failureCount === 0) {
          queryClient.invalidateQueries({ queryKey: [APPLE_MAPS_QUERY_KEYS.TOKEN] });
          return true;
        }
      }
      return false;
    },
    retryDelay: 1000,
  });

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    clearSearch,
    results,
    isLoading,
    error,
  };
}
