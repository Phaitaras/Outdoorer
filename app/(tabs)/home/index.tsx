import { FilterSection } from '@/components/common/filterSection';
import { ActivityList, type ActivityItem } from '@/components/home/activityList';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import { LocationHeader } from '@/components/home/locationHeader';
import type { Sentiment } from '@/components/home/sentiment';
import { TemperaturePickerModal } from '@/components/plan/temperaturePickerModal';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useCurrentUserId, useFilterState, useLocationPickerResult, useSyncLocationName } from '@/features/home';
import { useCurrentLocationGeocode, useLocationDisplayLabel } from '@/features/location';
import { usePlannerLocation } from '@/features/plan/hooks/usePlannerLocation';
import { useProfile } from '@/features/profile';
import { useWeather } from '@/features/weather';
import { useLocationContext } from '@/providers/location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { selectedLat, selectedLng, selectedAddress } = useLocalSearchParams<{
    selectedLat?: string;
    selectedLng?: string;
    selectedAddress?: string;
  }>();

  // Hooks
  const { location } = useLocationContext();
  const userId = useCurrentUserId();
  const { localityName } = useCurrentLocationGeocode(location);
  const { data: profile } = useProfile(userId);
  
  const {
    coordinates,
    setCoordinates,
    mapRegion,
    locationLabel,
    setLocationLabel,
  } = usePlannerLocation({}, location);

  useLocationPickerResult(selectedLat, selectedLng, selectedAddress, setLocationLabel, setCoordinates);
  useSyncLocationName(coordinates, locationLabel, setLocationLabel);

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(
    coordinates?.latitude ?? location?.latitude ?? null,
    coordinates?.longitude ?? location?.longitude ?? null
  );

  const {
    showFilters,
    setShowFilters,
    useWeatherPrefs,
    setUseWeatherPrefs,
    rainTolerance,
    setRainTolerance,
    tempMin,
    setTempMin,
    tempMax,
    setTempMax,
    windLevel,
    setWindLevel,
    tempPicker,
    setTempPicker,
    handleTempValueChange,
    resetFilters,
  } = useFilterState();

  const items = useMemo<ActivityItem[]>(() => {
    // console.log('Profile:', profile);
    console.log('Weather loading:', weatherLoading, 'Weather data:', !!weatherData, 'Coordinates:', coordinates);
    if (!profile) return [];

    const next6: Sentiment[] = ['GREAT', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD'];
    const windowText = '9:00 - 15:00';

    return (profile.activity_types ?? [])
      .map((enumVal: string) => {
        const title = LABEL_TO_ACTIVITY[enumVal];
        if (!title) return null;
        return {
          emoji: '',
          title,
          status: 'GOOD' as Sentiment,
          next6,
          windowText,
          onPress: () => {
            const params: any = { activity: title, status: 'GOOD' };
            if (coordinates && location && (
              Math.abs(coordinates.latitude - location.latitude) > 0.001 ||
              Math.abs(coordinates.longitude - location.longitude) > 0.001
            )) {
              params.lat = coordinates.latitude.toString();
              params.lng = coordinates.longitude.toString();
              params.locationName = locationLabel;
            }
            router.push({ pathname: '/(tabs)/activity', params });
          },
        } as ActivityItem;
      })
      .filter(Boolean) as ActivityItem[];
  }, [profile, router, coordinates, location, locationLabel]);

  const locationDisplayLabel = useLocationDisplayLabel(
    coordinates,
    location,
    locationLabel,
    localityName
  );

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 px-8 mt-6"
        showsVerticalScrollIndicator={false}
      >
        <LocationHeader
          locationLabel={locationDisplayLabel}
          onFiltersPress={() => setShowFilters(!showFilters)}
        />
        <FilterSection
          visible={showFilters}
          locationLabel={locationLabel}
          onLocationChange={setLocationLabel}
          coordinates={coordinates}
          mapRegion={mapRegion}
          onLocationPress={() => {
            router.push({
              pathname: '/(tabs)/home/location',
              params: coordinates 
                ? { initialLat: coordinates.latitude.toString(), initialLng: coordinates.longitude.toString() }
                : {},
            });
          }}
          useWeatherPrefs={useWeatherPrefs}
          rainTolerance={rainTolerance}
          tempMin={tempMin}
          tempMax={tempMax}
          windLevel={windLevel}
          tempPicker={tempPicker}
          onTempPickerOpen={setTempPicker}
          onTempPickerClose={() => setTempPicker(null)}
          onTempValueChange={handleTempValueChange}
          onClearFilters={() => {
            resetFilters();
            if (location) {
              setCoordinates({
                latitude: location.latitude,
                longitude: location.longitude,
              });
            }
            if (localityName) {
              setLocationLabel(localityName);
            }
          }}
          onConfirmFilters={(filters) => {
            setUseWeatherPrefs(filters.useWeatherPrefs);
            setRainTolerance(filters.rainTolerance);
            setTempMin(filters.tempMin);
            setTempMax(filters.tempMax);
            setWindLevel(filters.windLevel);
            setLocationLabel(filters.locationLabel);
            setShowFilters(false);
          }}
        />
        <CurrentWeatherCard weather={weatherData} isLoading={weatherLoading} error={weatherError} />
        <ActivityList items={items} />
      </ScrollView>
      
      <TemperaturePickerModal
        visible={tempPicker !== null}
        selectedValue={tempPicker === 'min' ? tempMin : tempMax}
        onValueChange={handleTempValueChange}
        onClose={() => setTempPicker(null)}
      />
    </View>
  );
}
