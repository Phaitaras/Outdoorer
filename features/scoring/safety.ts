import type { HourWeather } from '@/features/weather';
import type { ActivityKey } from './constants';
import { CRITICAL_THRESHOLDS, CRITICAL_WEATHERCODES, CRITICAL_WIND_GUST } from './constants';

/**
 * Check if an hour meets critical safety thresholds that force a POOR rating
 * Returns true if conditions are critical (unsafe)
 */
export function isCritical(hourWeather: HourWeather, sportKey: ActivityKey): boolean {
  // Global critical: severe weathercodes (thunderstorms, heavy rain/snow)
  if (CRITICAL_WEATHERCODES.includes(hourWeather.weathercode)) {
    return true;
  }

  // Global critical: wind gust exceeds gale force (62 km/h, Beaufort 8)
  if (hourWeather.wind_gusts_10m > CRITICAL_WIND_GUST) {
    return true;
  }

  // Sport-specific critical thresholds
  const thresholds = CRITICAL_THRESHOLDS[sportKey];

  // Temperature bounds
  if (thresholds.maxTemp !== undefined && hourWeather.temperature_2m > thresholds.maxTemp) {
    // For running, also check humidity via dew point
    // If temp > 37°C AND dew point indicates high humidity (>18°C), critical
    if (sportKey === 'running' && hourWeather.dew_point_2m > 18) {
      return true;
    }
    // For other sports with maxTemp, just check temp
    if (sportKey !== 'running') {
      return true;
    }
  }

  if (thresholds.minTemp !== undefined && hourWeather.temperature_2m < thresholds.minTemp) {
    return true;
  }

  // Precipitation (e.g., rock climbing >2.5mm)
  if (thresholds.maxPrecip !== undefined && hourWeather.precipitation > thresholds.maxPrecip) {
    return true;
  }

  // Wind gust upper bound (cycling, kayaking, surfing)
  if (thresholds.maxWindGust !== undefined && hourWeather.wind_gusts_10m > thresholds.maxWindGust) {
    return true;
  }

  // Wind gust lower bound (kitesurfing, windsurfing need minimum wind)
  if (thresholds.minWindGust !== undefined && hourWeather.wind_gusts_10m < thresholds.minWindGust) {
    return true;
  }

  // Alternative wind upper bound (for sports with a tight wind range)
  if (thresholds.maxWindGustAlt !== undefined && hourWeather.wind_gusts_10m > thresholds.maxWindGustAlt) {
    return true;
  }

  // No critical conditions met
  return false;
}
