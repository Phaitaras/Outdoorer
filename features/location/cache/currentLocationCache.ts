import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_LOCATION_CACHE_KEY = 'outdoorer:current-location-cache';

/** Distance in meters before triggering a new geocode */
export const LOCATION_BUCKET_RADIUS_METERS = 1000; // 1 km

export interface CachedLocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  localityName: string;
  /** Timestamp when cached */
  cachedAt: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getCachedCurrentLocation(): Promise<CachedLocationData | null> {
  try {
    const cached = await AsyncStorage.getItem(CURRENT_LOCATION_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as CachedLocationData;
  } catch {
    return null;
  }
}

export async function setCachedCurrentLocation(data: CachedLocationData): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_LOCATION_CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to cache current location:', err);
  }
}

export async function clearCachedCurrentLocation(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_LOCATION_CACHE_KEY);
  } catch {
    //
  }
}
