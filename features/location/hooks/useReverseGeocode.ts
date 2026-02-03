import { useAppleMapsToken } from '@/features/appleMaps';
import { useQuery } from '@tanstack/react-query';

const LOCATION_QUERY_KEYS = {
  REVERSE_GEOCODE: 'reverse-geocode',
} as const;

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface ReverseGeocodeResponse {
  results?: Array<{
    name?: string;
    formattedAddressLines?: string[];
    structuredAddress?: {
      locality?: string;
      subLocality?: string;
    };
  }>;
}

async function reverseGeocode(token: string, coordinates: Coordinates): Promise<string> {
  const params = new URLSearchParams({
    loc: `${coordinates.latitude},${coordinates.longitude}`,
    lang: 'en-GB',
  });

  const response = await fetch(
    `https://maps-api.apple.com/v1/reverseGeocode?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apple Maps reverse geocode error: ${error}`);
  }

  const data: ReverseGeocodeResponse = await response.json();
  const firstResult = data.results?.[0];

  if (firstResult?.name) {
    return firstResult.name;
  }

  const subLocality = firstResult?.structuredAddress?.subLocality;
  if (subLocality) {
    return subLocality;
  }

  const locality = firstResult?.structuredAddress?.locality;
  if (locality) {
    return locality;
  }

  if (firstResult?.formattedAddressLines && firstResult.formattedAddressLines.length > 0) {
    return firstResult.formattedAddressLines[0];
  }

  return `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`;
}

export function useReverseGeocode(coordinates: Coordinates | null) {
  const { data: token } = useAppleMapsToken();

  return useQuery({
    queryKey: [LOCATION_QUERY_KEYS.REVERSE_GEOCODE, coordinates?.latitude, coordinates?.longitude],
    queryFn: () => reverseGeocode(token!, coordinates!),
    enabled: Boolean(token && coordinates),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export { LOCATION_QUERY_KEYS };
