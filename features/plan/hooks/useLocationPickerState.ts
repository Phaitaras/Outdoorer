import { useCallback, useMemo, useRef, useState } from 'react';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';

import { LOCATION_PICKER_CONSTANTS, type AutocompleteResult } from '@/features/plan/constants';

type Coordinates = { latitude: number; longitude: number };

type InitialParams = {
  initialLat?: string;
  initialLng?: string;
};

export function useLocationPickerState(
  params: InitialParams,
  userLocation: Coordinates | null
) {
  const mapRef = useRef<MapView>(null);

  const initialRegion = useMemo<Region | null>(() => {
    const source = params.initialLat && params.initialLng
      ? { latitude: parseFloat(params.initialLat), longitude: parseFloat(params.initialLng) }
      : userLocation;

    if (!source) return null;

    return {
      latitude: source.latitude,
      longitude: source.longitude,
      latitudeDelta: LOCATION_PICKER_CONSTANTS.DEFAULT_DELTA,
      longitudeDelta: LOCATION_PICKER_CONSTANTS.DEFAULT_DELTA,
    };
  }, [params.initialLat, params.initialLng, userLocation]);

  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(
    initialRegion ? { latitude: initialRegion.latitude, longitude: initialRegion.longitude } : null
  );

  const [showResults, setShowResults] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleRegionChange = useCallback(
    (newRegion: Region) => {
      if (isDragging) {
        setMarkerPosition({
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
        });
      }
    },
    [isDragging]
  );

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setMarkerPosition({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
    setIsDragging(false);
  }, []);

  const handleSelectResult = useCallback(
    (result: AutocompleteResult, setSearchQuery: (value: string) => void) => {
      if (!result.location) return;

      setMarkerPosition(result.location);
      setSearchQuery(result.displayLines[0] || '');

      const newRegion: Region = {
        latitude: result.location.latitude,
        longitude: result.location.longitude,
        latitudeDelta: LOCATION_PICKER_CONSTANTS.ZOOM_DELTA,
        longitudeDelta: LOCATION_PICKER_CONSTANTS.ZOOM_DELTA,
      };

      mapRef.current?.animateToRegion(newRegion, LOCATION_PICKER_CONSTANTS.ANIMATION_DURATION);
    },
    []
  );

  return {
    mapRef,
    initialRegion,
    markerPosition,
    showResults,
    setShowResults,
    isDragging,
    setIsDragging,
    handleRegionChange,
    handleRegionChangeComplete,
    handleSelectResult,
  };
}