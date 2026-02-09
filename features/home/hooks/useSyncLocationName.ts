import { useReverseGeocode } from '@/features/location';
import { useEffect } from 'react';

type SetLocationLabel = (label: string) => void;
type Coordinates = { latitude: number; longitude: number } | null;

export function useSyncLocationName(coordinates: Coordinates, locationLabel: string, setLocationLabel: SetLocationLabel) {
  const { data: resolvedLocationName } = useReverseGeocode(coordinates);

  useEffect(() => {
    if (resolvedLocationName && resolvedLocationName !== locationLabel) {
      setLocationLabel(resolvedLocationName);
    }
  }, [resolvedLocationName, locationLabel, setLocationLabel]);
}
