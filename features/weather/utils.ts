import { WEATHER_CODE_TO_DESCRIPTION } from '@/constants/weather';
import type { WeatherData } from './hooks/useWeather';

export function getHourlyWeatherData(
  selectedHour: string,
  weatherData: WeatherData | null
): [string, string, string, string][] {
  if (!weatherData?.hours || weatherData.hours.length === 0) return [];

  const hourIndex = weatherData.hours.findIndex((h) => {
    const hDate = new Date(h.time);
    const hHour = hDate.getHours().toString().padStart(2, '0') + ':' + hDate.getMinutes().toString().padStart(2, '0');
    return hHour === selectedHour;
  });

  if (hourIndex === -1) return [];

  const hour = weatherData.hours[hourIndex];
  const tempUnit = weatherData.units === 'imperial' ? '°F' : '°C';
  const speedUnit = weatherData.units === 'imperial' ? 'mph' : 'km/h';
  const weatherDescription = WEATHER_CODE_TO_DESCRIPTION[hour.weathercode] || 'Unknown';

  return [
    ['Temperature', `${Math.round(hour.temperature_2m)}${tempUnit}`, 'Wind Speed', `${Math.round(hour.wind_speed_10m)} ${speedUnit}`],
    ['Weather', weatherDescription, 'Wind Direction', `${Math.round(hour.wind_direction_10m)}°`],
    ['Precipitation', `${hour.precipitation} mm`, 'Wind Gust', `${Math.round(hour.wind_gusts_10m)} ${speedUnit}`],
  ];
}
