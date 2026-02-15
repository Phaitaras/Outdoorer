import { WEATHER_CODE_TO_DESCRIPTION } from '@/constants/weather';
import type { MetricSystem } from '@/features/profile/types';
import { formatPrecip, formatSpeed, formatTemp } from '@/utils/units';
import type { WeatherData } from './hooks/useWeather';

export function getHourlyWeatherData(
  selectedHour: string,
  weatherData: WeatherData | null,
  metricSystem: MetricSystem = 'metric'
): [string, string, string, string][] {
  if (!weatherData?.hours || weatherData.hours.length === 0) return [];

  const hourIndex = weatherData.hours.findIndex((h) => {
    const hDate = new Date(h.time);
    const hHour = hDate.getHours().toString().padStart(2, '0') + ':' + hDate.getMinutes().toString().padStart(2, '0');
    return hHour === selectedHour;
  });

  if (hourIndex === -1) return [];

  const hour = weatherData.hours[hourIndex];
  const weatherDescription = WEATHER_CODE_TO_DESCRIPTION[hour.weathercode] || 'Unknown';

  return [
    ['Temperature', formatTemp(hour.temperature_2m, metricSystem), 'Wind Speed', formatSpeed(hour.wind_speed_10m, metricSystem)],
    ['Weather', weatherDescription, 'Wind Direction', `${Math.round(hour.wind_direction_10m)}°`],
    ['Precipitation', formatPrecip(hour.precipitation, metricSystem), 'Wind Gust', formatSpeed(hour.wind_gusts_10m, metricSystem)],
    ['Dew Point', formatTemp(hour.dew_point_2m, metricSystem), 'Precip. Prob.', `${Math.round(hour.precipitation_probability)}%`],
  ];
}
