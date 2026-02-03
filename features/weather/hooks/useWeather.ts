import type { WeatherData } from '@/features/weather/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { WEATHER_QUERY_KEYS } from '../constants';

async function fetchWeather24h(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('get-weather-24h', {
    body: { lat: latitude, lon: longitude },
  });

  if (error) throw error;
  // console.log('Weather data fetched:', data);
  const shaped = {
    ...data,
    hours: data.dayHours,
  } as WeatherData;
  return shaped;
}

// Round coordinates to 0.01 (~1.1km precision)
function bucketCoordinate(coord: number): number {
  return Math.round(coord * 100) / 100;
}

export function useWeather(latitude: number | null, longitude: number | null) {
  const bucketedLat = latitude ? bucketCoordinate(latitude) : null;
  const bucketedLon = longitude ? bucketCoordinate(longitude) : null;

  return useQuery({
    queryKey: [WEATHER_QUERY_KEYS.WEATHER, bucketedLat, bucketedLon],
    queryFn: () => {
      if (!bucketedLat || !bucketedLon) throw new Error('Missing coordinates');
      return fetchWeather24h(bucketedLat, bucketedLon);
    },
    enabled: !!(bucketedLat && bucketedLon),
  });
}
