import { useMemo } from 'react';

export function useLocationDisplayLabel(
  coordinates: { latitude: number; longitude: number } | null,
  gpsLocation: { latitude: number; longitude: number } | null,
  filterLocationLabel: string,
  localityName: string | null
): string {
  return useMemo(() => {
    // Check if custom location is selected (coordinates differ from GPS by >0.001°)
    const isCustomLocation = coordinates && gpsLocation && (
      Math.abs(coordinates.latitude - gpsLocation.latitude) > 0.001 ||
      Math.abs(coordinates.longitude - gpsLocation.longitude) > 0.001
    );

    // Show detailed location from filter if custom coordinates selected,
    // otherwise show bucketed locality from GPS
    return isCustomLocation ? filterLocationLabel : (localityName || 'Locating...');
  }, [coordinates, gpsLocation, filterLocationLabel, localityName]);
}
