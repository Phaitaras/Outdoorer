import * as ExpoLocation from 'expo-location';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';

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
  const watchSubscriptionRef = useRef<ExpoLocation.LocationSubscription | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const stopWatching = useCallback(() => {
    watchSubscriptionRef.current?.remove();
    watchSubscriptionRef.current = null;
  }, []);

  const startWatching = useCallback(async () => {
    if (watchSubscriptionRef.current) return;

    try {
      watchSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.Balanced,
          timeInterval: 60_000,
          distanceInterval: 100,
        },
        (nextLocation) => {
          setLocation({
            latitude: nextLocation.coords.latitude,
            longitude: nextLocation.coords.longitude,
          });
        }
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to start location watch');
    }
  }, []);

  const requestAndFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        stopWatching();
        setPermissionStatus('denied');
        setError('Location permission denied');
        setLocation(null);
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your app settings to use location-based features.'
        );
        return;
      }

      setPermissionStatus('granted');
      const loc = await ExpoLocation.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      await startWatching();
    } catch (err: any) {
      setError(err?.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, [startWatching, stopWatching]);

  const syncFromExistingPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await ExpoLocation.getForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus('granted');
        const loc = await ExpoLocation.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        await startWatching();
        return;
      }

      if (status === 'denied') {
        stopWatching();
        setPermissionStatus('denied');
        setLocation(null);
        return;
      }

      stopWatching();
      setPermissionStatus('unknown');
      setLocation(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to sync location');
    } finally {
      setLoading(false);
    }
  }, [startWatching, stopWatching]);

  useEffect(() => {
    syncFromExistingPermission();
  }, [syncFromExistingPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackgrounded = /inactive|background/.test(appStateRef.current);
      if (wasBackgrounded && nextState === 'active') {
        syncFromExistingPermission();
      }
      appStateRef.current = nextState;
    });

    return () => {
      subscription.remove();
      stopWatching();
    };
  }, [syncFromExistingPermission, stopWatching]);

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
