import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export type WeatherData = {
  current: {
    code: number;
    temp: number;
    time: string;
  };
  hours: Array<{
    temperature_2m: number;
    time: string;
    weathercode: number;
  }>;
};

async function fetchWeather6h(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('get-weather-6h', {
    body: { lat: latitude, lon: longitude },
  });

  if (error) throw error;
  console.log('Weather data fetched:', data);
  return data as WeatherData;
}

// Round coordinates to 0.01 (~1.1km precision)
function bucketCoordinate(coord: number): number {
  return Math.round(coord * 100) / 100;
}

export function useWeather(latitude: number | null, longitude: number | null) {
  const bucketedLat = latitude ? bucketCoordinate(latitude) : null;
  const bucketedLon = longitude ? bucketCoordinate(longitude) : null;

  return useQuery({
    queryKey: ['weather', bucketedLat, bucketedLon],
    queryFn: () => {
      if (!bucketedLat || !bucketedLon) throw new Error('Missing coordinates');
      return fetchWeather6h(bucketedLat, bucketedLon);
    },
    enabled: !!(bucketedLat && bucketedLon),
  });
}
