import type { Sentiment } from '@/components/home/sentiment';
import { ACTIVITY_TO_LABEL } from '@/constants/activities';
import { useReverseGeocode } from '@/features/location';
import type { MetricSystem } from '@/features/profile/types';
import { computeHourlySentiments, type ActivityKey, type FilterState } from '@/features/scoring';
import { getHourlyWeatherData, useWeather } from '@/features/weather';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { findRecommendedWindow, type HourBar } from '@/utils/activity';
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
  useWeatherPrefs?: string;
  rainTolerance?: string;
  tempMin?: string;
  tempMax?: string;
  windLevel?: string;
  metricSystem?: MetricSystem;
};

// Water sports that need marine data
const WATER_SPORTS: ActivityKey[] = ['kayaking', 'sailing', 'surfing', 'kitesurfing', 'windsurfing'];

interface SelectedLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export function useActivityDetail() {
  const params = useLocalSearchParams<ActivityParams>();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment);
  const metricSystem = (params.metricSystem as MetricSystem) ?? 'metric';
  const { location } = useLocationContext();

  const activityIdParam = params.activityId ? Number(params.activityId) : null;
  const { data: activityData, isLoading: activityDataLoading } = useActivityById(activityIdParam);
  const isActivityDataForCurrentId = !activityIdParam || activityData?.id === activityIdParam;

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
    if (!isActivityDataForCurrentId) return null;
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
  }, [activityData?.location, isActivityDataForCurrentId]);

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

  const activityTypeMap: Record<string, ActivityKey> = {
    'Running': 'running',
    'Cycling': 'cycling',
    'Hiking': 'hiking',
    'Rock Climbing': 'rock_climbing',
    'Kayaking': 'kayaking',
    'Sailing': 'sailing',
    'Surfing': 'surfing',
    'Kitesurfing': 'kitesurfing',
    'Windsurfing': 'windsurfing',
    'Generic Sport': 'generic_sports',
  };
  
  const activityType = (activityTypeMap[activity] || (ACTIVITY_TO_LABEL[activity] ?? 'generic_sports')) as ActivityKey;

  const needsMarine = WATER_SPORTS.includes(activityType as ActivityKey);

  const weatherDate = baseDate.toISOString().slice(0, 10);
  
  const { data: weatherData, isLoading: weatherLoading } = useWeather(
    selectedLocation?.latitude ?? null,
    selectedLocation?.longitude ?? null,
    weatherDate,
    needsMarine
  );

  // Parse filter params from URL
  const filters = useMemo<FilterState | null>(() => {
    if (params.useWeatherPrefs !== 'true') return null;
    return {
      useWeatherPrefs: true,
      rainTolerance: (params.rainTolerance as any) ?? 'light',
      tempMin: params.tempMin ? parseInt(params.tempMin) : 8,
      tempMax: params.tempMax ? parseInt(params.tempMax) : 28,
      windLevel: params.windLevel ? parseInt(params.windLevel) : 1,
    };
  }, [params.useWeatherPrefs, params.rainTolerance, params.tempMin, params.tempMax, params.windLevel]);

  // Compute dynamic graph data from weather
  const graphData = useMemo<HourBar[]>(() => {
    if (!weatherData?.dayHours) return [];
    const hourlySentiments = computeHourlySentiments(
      weatherData.dayHours,
      activityType as ActivityKey,
      filters
    );
    return hourlySentiments.map((h) => ({
      hour: h.hour,
      sentiment: h.sentiment,
      score: h.score,
    }));
  }, [weatherData, activityType, filters]);

  useEffect(() => {
    if (graphData.length === 0) return;
    const currentHour = new Date().getHours().toString().padStart(2, '0');
    const currentHourIndex = graphData.findIndex(bar => bar.hour.startsWith(currentHour));
    if (currentHourIndex !== -1) {
      setSelectedIndex(currentHourIndex);
    }
  }, [graphData]);

  const { recommendedStart, recommendedEnd } = useMemo(() => {
    if (graphData.length === 0) return { recommendedStart: 0, recommendedEnd: 0 };
    const window = findRecommendedWindow(graphData);
    return { recommendedStart: window.start, recommendedEnd: window.end };
  }, [graphData]);

  const selectedBar = useMemo(() => graphData[selectedIndex] ?? graphData[0] ?? { hour: '00:00', sentiment: 'POOR' as Sentiment }, [graphData, selectedIndex]);

  const hourlyWeatherData = useMemo(() =>
    getHourlyWeatherData(selectedBar.hour, weatherData ?? null, metricSystem),
  [selectedBar.hour, weatherData, metricSystem]
  );

  const recommendedLabel = graphData.length > 0 
    ? `${graphData[recommendedStart].hour} - ${graphData[recommendedEnd].hour}` 
    : 'N/A';

  const dateLabel = useMemo(() =>
    baseDate.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }),
  [baseDate]);

  useEffect(() => {
    if (graphData.length === 0) return;
    const [rsHour, rsMinute] = graphData[recommendedStart].hour.split(':').map(Number);
    const [reHour, reMinute] = graphData[recommendedEnd].hour.split(':').map(Number);
    const start = new Date(baseDate);
    start.setHours(rsHour, rsMinute, 0, 0);
    const end = new Date(baseDate);
    end.setHours(reHour, reMinute, 0, 0);
    setPlanStart(start);
    setPlanEnd(end);
  }, [baseDate, recommendedStart, recommendedEnd, graphData]);

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
    graphData,
    metricSystem,
    isLoading:
      weatherLoading ||
      (!!activityIdParam && (activityDataLoading || !isActivityDataForCurrentId)),
  };
}
