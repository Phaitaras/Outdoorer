import { LOCATION_PICKER_CONSTANTS } from '@/features/plan/constants';
import { useEffect, useMemo, useState } from 'react';

type PickerParams = {
  selectedLat?: string;
  selectedLng?: string;
  selectedAddress?: string;
};

type Coordinates = { latitude: number; longitude: number };

export function usePlannerLocation(
  params: PickerParams,
  currentLocation: Coordinates | null
) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    if (params.selectedLat && params.selectedLng) {
      const lat = parseFloat(params.selectedLat);
      const lng = parseFloat(params.selectedLng);

      if (coordinates?.latitude !== lat || coordinates?.longitude !== lng) {
        setCoordinates({ latitude: lat, longitude: lng });
        setLocationLabel(params.selectedAddress || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
      return;
    }

    if (!coordinates && currentLocation) {
      setCoordinates({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      setLocationLabel(
        `${currentLocation.latitude.toFixed(3)}, ${currentLocation.longitude.toFixed(3)}`
      );
    }
  }, [params.selectedLat, params.selectedLng, params.selectedAddress, currentLocation, coordinates]);

  const mapRegion = useMemo(() => {
    if (!coordinates) return null;
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: LOCATION_PICKER_CONSTANTS.DEFAULT_DELTA,
      longitudeDelta: LOCATION_PICKER_CONSTANTS.DEFAULT_DELTA,
    };
  }, [coordinates]);

  return {
    coordinates,
    mapRegion,
    locationLabel,
    setLocationLabel,
  };
}