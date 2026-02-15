import { FilterSection } from '@/components/common/filterSection';
import { ActivityList, type ActivityItem } from '@/components/home/activityList';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import { LocationHeader } from '@/components/home/locationHeader';
import { TemperaturePickerModal } from '@/components/plan/temperaturePickerModal';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useCurrentUserId, useFilterState, useLocationPickerResult, useSyncLocationName } from '@/features/home';
import { useCurrentLocationGeocode, useLocationDisplayLabel } from '@/features/location';
import { usePlannerLocation } from '@/features/plan/hooks/usePlannerLocation';
import { useProfile } from '@/features/profile';
import { useActivityScoring, type FilterState } from '@/features/scoring';
import { useWeather } from '@/features/weather';
import { useLocationContext } from '@/providers/location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

// Water sports that need marine data
const WATER_SPORTS = ['kayaking', 'sailing', 'surfing', 'kitesurfing', 'windsurfing'];

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

  // Check if profile includes any water sports
  const needsMarine = useMemo(() => {
    if (!profile?.activity_types) return false;
    return profile.activity_types.some((type: string) => WATER_SPORTS.includes(type));
  }, [profile?.activity_types]);

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(
    coordinates?.latitude ?? location?.latitude ?? null,
    coordinates?.longitude ?? location?.longitude ?? null,
    undefined,
    needsMarine
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

  // Build filters object for scoring
  const filters = useMemo<FilterState | null>(() => {
    if (!useWeatherPrefs) return null;
    return {
      useWeatherPrefs,
      rainTolerance,
      tempMin,
      tempMax,
      windLevel,
    };
  }, [useWeatherPrefs, rainTolerance, tempMin, tempMax, windLevel]);

  // Compute activity scores
  const activityScores = useActivityScoring(
    weatherData,
    profile?.activity_types ?? [],
    filters
  );

  const items = useMemo<ActivityItem[]>(() => {
    if (!profile) return [];

    return (profile.activity_types ?? [])
      .map((enumVal: string) => {
        const title = LABEL_TO_ACTIVITY[enumVal];
        if (!title) return null;

        // Get computed scores or use defaults
        const scoreResult = activityScores.get(enumVal);
        const status = scoreResult?.status ?? 'GOOD';
        const next6 = scoreResult?.next6 ?? ['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD'];
        const windowText = scoreResult?.windowText ?? 'N/A';

        return {
          emoji: '',
          title,
          status,
          next6,
          windowText,
          onPress: () => {
            const params: any = { activity: title, status, metricSystem: profile?.metric ?? 'metric' };
            if (coordinates && location && (
              Math.abs(coordinates.latitude - location.latitude) > 0.001 ||
              Math.abs(coordinates.longitude - location.longitude) > 0.001
            )) {
              params.lat = coordinates.latitude.toString();
              params.lng = coordinates.longitude.toString();
              params.locationName = locationLabel;
            }
            // Pass filter params through navigation
            if (useWeatherPrefs) {
              params.useWeatherPrefs = 'true';
              params.rainTolerance = rainTolerance;
              params.tempMin = tempMin.toString();
              params.tempMax = tempMax.toString();
              params.windLevel = windLevel.toString();
            }
            router.push({ pathname: '/(tabs)/activity', params });
          },
        } as ActivityItem;
      })
      .filter(Boolean) as ActivityItem[];
  }, [profile, activityScores, router, coordinates, location, locationLabel, useWeatherPrefs, rainTolerance, tempMin, tempMax, windLevel]);

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
          metricSystem={profile?.metric ?? 'metric'}
        />
        <CurrentWeatherCard weather={weatherData} isLoading={weatherLoading} error={weatherError} metricSystem={profile?.metric ?? 'metric'} />
        <ActivityList items={items} />
      </ScrollView>
      
      <TemperaturePickerModal
        visible={tempPicker !== null}
        selectedValue={tempPicker === 'min' ? tempMin : tempMax}
        onValueChange={handleTempValueChange}
        onClose={() => setTempPicker(null)}
        metricSystem={profile?.metric ?? 'metric'}
      />
    </View>
  );
}
