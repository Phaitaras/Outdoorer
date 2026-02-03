import { GRAPH_DATA } from '@/components/home/activity/constants';
import type { Sentiment } from '@/components/home/sentiment';
import { ACTIVITY_TO_LABEL } from '@/constants/activities';
import { useReverseGeocode } from '@/features/location';
import { getHourlyWeatherData, useWeather } from '@/features/weather';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { findRecommendedWindow } from '@/utils/activity';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useActivityById } from './useActivityById';
import { useCreateActivity } from './useCreateActivity';

export type ActivityParams = {
  activity?: string;
  status?: Sentiment;
  date?: string;
  activityId?: string;
  lat?: string;
  lng?: string;
  locationName?: string;
};

interface SelectedLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export function useActivityDetail() {
  const params = useLocalSearchParams<ActivityParams>();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment) ?? 'GOOD';
  const { location } = useLocationContext();

  const activityIdParam = params.activityId ? Number(params.activityId) : null;
  const { data: activityData } = useActivityById(activityIdParam);

  // use activity's actual date or use params.date or today
  const baseDate = useMemo(() => {
    if (activityData?.start_time) {
      return new Date(activityData.start_time);
    }
    return params.date ? new Date(params.date) : new Date();
  }, [activityData?.start_time, params.date]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFigures, setShowFigures] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planStart, setPlanStart] = useState<Date>(baseDate);
  const [planEnd, setPlanEnd] = useState<Date>(baseDate);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const locationFromParams = useMemo<SelectedLocation | null>(() => {
    if (typeof params.lat === 'string' && typeof params.lng === 'string') {
      const lat = parseFloat(params.lat);
      const lng = parseFloat(params.lng);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        const locationNameParam = typeof params.locationName === 'string' ? params.locationName : undefined;
        return {
          latitude: lat,
          longitude: lng,
          name: locationNameParam ?? `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
        };
      }
    }
    return null;
  }, [params.lat, params.lng, params.locationName]);

  const locationFromActivity = useMemo<SelectedLocation | null>(() => {
    if (activityData?.location && 
        typeof activityData.location.latitude === 'number' && 
        typeof activityData.location.longitude === 'number') {
      return {
        latitude: activityData.location.latitude,
        longitude: activityData.location.longitude,
        name: activityData.location.name || `${activityData.location.latitude.toFixed(3)}, ${activityData.location.longitude.toFixed(3)}`,
      };
    }
    return null;
  }, [activityData?.location]);

  const fallbackLocation = useMemo<SelectedLocation | null>(() => {
    if (!location) return null;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      name: `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`,
    };
  }, [location]);

  // Priority: activity's stored location > params location > current GPS location
  const selectedLocation = locationFromActivity ?? locationFromParams ?? fallbackLocation;
  const { data: resolvedLocationName } = useReverseGeocode(
    selectedLocation
      ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
      : null
  );

  const locationLabel = resolvedLocationName || selectedLocation?.name || 'Unknown location';

  const activityType = ACTIVITY_TO_LABEL[activity] ?? 'generic_sports';

  // Use activity's actual location if available, otherwise use params or fallback

  // format date for API (YYYY-MM-DD)
  const weatherDate = baseDate.toISOString().slice(0, 10);
  
  const { data: weatherData } = useWeather(
    selectedLocation?.latitude ?? null,
    selectedLocation?.longitude ?? null,
    weatherDate
  );

  const { recommendedStart, recommendedEnd } = useMemo(() => {
    const window = findRecommendedWindow();
    return { recommendedStart: window.start, recommendedEnd: window.end };
  }, []);

  const selectedBar = useMemo(() => GRAPH_DATA[selectedIndex] ?? GRAPH_DATA[0], [selectedIndex]);

  const hourlyWeatherData = useMemo(() =>
    getHourlyWeatherData(selectedBar.hour, weatherData ?? null),
  [selectedBar.hour, weatherData]
  );

  const recommendedLabel = `${GRAPH_DATA[recommendedStart].hour} - ${GRAPH_DATA[recommendedEnd].hour}`;

  const dateLabel = useMemo(() =>
    baseDate.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }),
  [baseDate]);

  useEffect(() => {
    const [rsHour, rsMinute] = GRAPH_DATA[recommendedStart].hour.split(':').map(Number);
    const [reHour, reMinute] = GRAPH_DATA[recommendedEnd].hour.split(':').map(Number);
    const start = new Date(baseDate);
    start.setHours(rsHour, rsMinute, 0, 0);
    const end = new Date(baseDate);
    end.setHours(reHour, reMinute, 0, 0);
    setPlanStart(start);
    setPlanEnd(end);
  }, [baseDate, recommendedStart, recommendedEnd]);

  const createActivityMutation = useCreateActivity();

  const handleCreateActivity = useCallback(async (start: Date, end: Date) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create an activity.');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'Location details are missing. Please try planning again.');
      return;
    }

    try {
      await createActivityMutation.mutateAsync({
        userId,
        activityType,
        location: {
          name: resolvedLocationName || selectedLocation.name,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        startTime: start,
        endTime: end,
      });

      Alert.alert('Success', 'Your activity has been planned.');
      setShowPlanModal(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save your activity. Please try again.');
    }
  }, [activityType, createActivityMutation, resolvedLocationName, selectedLocation, userId]);

  return {
    activity,
    status,
    activityIdParam,
    selectedIndex,
    setSelectedIndex,
    showFigures,
    setShowFigures,
    showPlanModal,
    setShowPlanModal,
    planStart,
    planEnd,
    recommendedStart,
    recommendedEnd,
    recommendedLabel,
    selectedBar,
    hourlyWeatherData,
    activityData,
    locationLabel,
    dateLabel,
    handleCreateActivity,
  };
}
