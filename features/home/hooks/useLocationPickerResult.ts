import { useEffect } from 'react';

type SetLocationLabel = (label: string) => void;
type SetCoordinates = (coords: { latitude: number; longitude: number }) => void;

export function useLocationPickerResult(
  selectedLat: string | undefined,
  selectedLng: string | undefined,
  selectedAddress: string | undefined,
  setLocationLabel: SetLocationLabel,
  setCoordinates: SetCoordinates
) {
  useEffect(() => {
    if (selectedLat && selectedLng && selectedAddress) {
      setLocationLabel(selectedAddress);
      setCoordinates({
        latitude: parseFloat(selectedLat),
        longitude: parseFloat(selectedLng),
      });
    }
  }, [selectedLat, selectedLng, selectedAddress, setLocationLabel, setCoordinates]);
}
