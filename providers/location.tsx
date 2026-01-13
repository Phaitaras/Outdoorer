import * as ExpoLocation from 'expo-location';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Coordinates = { latitude: number; longitude: number };

interface LocationContextValue {
  location: Coordinates | null;
  permissionStatus: 'unknown' | 'granted' | 'denied';
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestAndFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        setError('Location permission denied');
        setLocation(null);
        return;
      }

      setPermissionStatus('granted');
      const loc = await ExpoLocation.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (err: any) {
      setError(err?.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestAndFetch();
  }, [requestAndFetch]);

  const value: LocationContextValue = {
    location,
    permissionStatus,
    loading,
    error,
    refresh: requestAndFetch,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return ctx;
}
