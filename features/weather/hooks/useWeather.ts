import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { WEATHER_QUERY_KEYS } from '../constants';

export type WeatherData = {
  units: 'metric' | 'imperial';
  current: {
    time: string;
    temperature_2m: number;
    weathercode: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
  };
  dayHours: Array<{
    time: string;
    temperature_2m: number;
    weathercode: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
  }>;
  next6: Array<{
    time: string;
    temperature_2m: number;
    weathercode: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
  }>;
  hours?: Array<{
    time: string;
    temperature_2m: number;
    weathercode: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
  }>;
  location: { lat: number; lon: number };
};

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
