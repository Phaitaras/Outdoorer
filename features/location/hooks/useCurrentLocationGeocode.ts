import { useAppleMapsToken } from '@/features/appleMaps';
import { useCallback, useEffect, useState } from 'react';
import {
    CachedLocationData,
    calculateDistanceMeters,
    getCachedCurrentLocation,
    LOCATION_BUCKET_RADIUS_METERS,
    setCachedCurrentLocation,
} from '../cache/currentLocationCache';

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface ReverseGeocodeResponse {
  results?: Array<{
    structuredAddress?: {
      locality?: string;
      administrativeArea?: string;
      country?: string;
    };
  }>;
}


// reverse geocode for current location, returns locality
async function reverseGeocodeLocality(
  token: string,
  coordinates: Coordinates
): Promise<string> {
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
    throw new Error('Failed to reverse geocode');
  }

  const data: ReverseGeocodeResponse = await response.json();
  const structured = data.results?.[0]?.structuredAddress;

  // locality > administrativeArea > country
  if (structured?.locality) {
    return structured.locality;
  }
  if (structured?.administrativeArea) {
    return structured.administrativeArea;
  }
  if (structured?.country) {
    return structured.country;
  }

  return `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`;
}

interface UseCurrentLocationGeocodeResult {
  localityName: string | null;
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that manages current location geocoding with bucketed caching.
 * - Stores true lat/long locally
 * - Only re-geocodes when user moves >1km from cached position
 * - Returns locality (broad scope) for privacy-friendly UX
 */
export function useCurrentLocationGeocode(
  currentCoordinates: Coordinates | null
): UseCurrentLocationGeocodeResult {
  const { data: token } = useAppleMapsToken();
  const [localityName, setLocalityName] = useState<string | null>(null);
  const [cachedCoordinates, setCachedCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // load cache on mount
  useEffect(() => {
    (async () => {
      const cached = await getCachedCurrentLocation();
      if (cached) {
        setLocalityName(cached.localityName);
        setCachedCoordinates(cached.coordinates);
      }
      setInitialized(true);
    })();
  }, []);

  const shouldRegeocode = useCallback(
    (newCoords: Coordinates, cached: CachedLocationData | null): boolean => {
      if (!cached) return true;

      const distance = calculateDistanceMeters(
        cached.coordinates.latitude,
        cached.coordinates.longitude,
        newCoords.latitude,
        newCoords.longitude
      );

      return distance > LOCATION_BUCKET_RADIUS_METERS;
    },
    []
  );

  useEffect(() => {
    if (!initialized || !currentCoordinates || !token) return;

    (async () => {
      const cached = await getCachedCurrentLocation();

      if (!shouldRegeocode(currentCoordinates, cached)) {
        // within bucket radius, use cached locality but update true coords
        if (cached) {
          setLocalityName(cached.localityName);
          setCachedCoordinates(currentCoordinates);
          await setCachedCurrentLocation({
            ...cached,
            coordinates: currentCoordinates,
            cachedAt: Date.now(),
          });
        }
        return;
      }

      // outside bucket, need to geocode
      setIsLoading(true);
      setError(null);

      try {
        const locality = await reverseGeocodeLocality(token, currentCoordinates);
        setLocalityName(locality);
        setCachedCoordinates(currentCoordinates);

        await setCachedCurrentLocation({
          coordinates: currentCoordinates,
          localityName: locality,
          cachedAt: Date.now(),
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to geocode location');
        // keep previous cached value on error
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentCoordinates, token, initialized, shouldRegeocode]);

  return {
    localityName,
    coordinates: cachedCoordinates ?? currentCoordinates,
    isLoading,
    error,
  };
}
