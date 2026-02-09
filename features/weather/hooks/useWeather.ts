import type { WeatherData } from '@/features/weather/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { WEATHER_QUERY_KEYS } from '../constants';

async function fetchWeather24h(
  latitude: number,
  longitude: number,
  date?: string
): Promise<WeatherData> {
  const body: { lat: number; lon: number; date?: string } = { 
    lat: latitude, 
    lon: longitude 
  };
  
  if (date) {
    body.date = date;
  }

  console.log('Fetching weather for:', { lat: latitude, lon: longitude, date });

  const { data, error } = await supabase.functions.invoke('get-weather-24h', {
    body,
  });

  if (error) {
    // Try to parse error response if it's JSON
    let errorMessage = error.message;
    if (typeof error === 'object' && error.context?.status === 400) {
      // The error might be in the response body
      errorMessage = `Weather API Error (${error.context.status}): ${error.message}`;
    }
    console.error('Weather fetch error:', errorMessage, error);
    throw new Error(errorMessage);
  }

  if (!data) {
    throw new Error('No data returned from weather API');
  }

  console.log('Weather data fetched successfully for:', { lat: latitude, lon: longitude });
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

export function useWeather(
  latitude: number | null, 
  longitude: number | null, 
  date?: string
) {
  const bucketedLat = latitude ? bucketCoordinate(latitude) : null;
  const bucketedLon = longitude ? bucketCoordinate(longitude) : null;

  return useQuery({
    queryKey: [WEATHER_QUERY_KEYS.WEATHER, bucketedLat, bucketedLon, date],
    queryFn: () => {
      if (!bucketedLat || !bucketedLon) throw new Error('Missing coordinates');
      return fetchWeather24h(bucketedLat, bucketedLon, date);
    },
    enabled: !!(bucketedLat && bucketedLon),
  });
}
