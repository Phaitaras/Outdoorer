import { LocationPickerScreen } from '@/components/common/locationPickerScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function HomeLocationPicker() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialLat?: string; initialLng?: string }>();

  return (
    <LocationPickerScreen
      initialLat={params.initialLat}
      initialLng={params.initialLng}
      onConfirm={(latitude, longitude, address) => {
        router.replace({
          pathname: '/(tabs)/home',
          params: {
            selectedLat: latitude.toString(),
            selectedLng: longitude.toString(),
            selectedAddress: address,
          },
        });
      }}
      onBack={() => router.back()}
    />
  );
}
