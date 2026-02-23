import { LocationPickerScreen } from '@/components/common/locationPickerScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function PlanLocationPicker() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    initialLat?: string;
    initialLng?: string;
    activity?: string;
    date?: string;
    useWeatherPrefs?: string;
    rainTolerance?: string;
    tempMin?: string;
    tempMax?: string;
    windLevel?: string;
  }>();

  return (
    <LocationPickerScreen
      initialLat={params.initialLat}
      initialLng={params.initialLng}
      onConfirm={(latitude, longitude, address) => {
        router.replace({
          pathname: '/(tabs)/plan',
          params: {
            selectedLat: latitude.toString(),
            selectedLng: longitude.toString(),
            selectedAddress: address,
            activity: params.activity,
            date: params.date,
            useWeatherPrefs: params.useWeatherPrefs,
            rainTolerance: params.rainTolerance,
            tempMin: params.tempMin,
            tempMax: params.tempMax,
            windLevel: params.windLevel,
          },
        });
      }}
      onBack={() => router.back()}
    />
  );
}
