import type { HourWeather } from '@/features/weather';
import type { ActivityKey } from './constants';
import { CRITICAL_THRESHOLDS, CRITICAL_WEATHERCODES, CRITICAL_WIND_GUST } from './constants';

/**
 * Check if an hour meets critical safety thresholds that force a POOR rating
 * Returns true if conditions are critical (unsafe)
 */
export function isCritical(hourWeather: HourWeather, sportKey: ActivityKey): boolean {
  // Global critical: severe weathercodes
  if (CRITICAL_WEATHERCODES.includes(hourWeather.weathercode)) {
    return true;
  }

  // Global critical: wind gust exceeds gale force
  if (hourWeather.wind_gusts_10m > CRITICAL_WIND_GUST) {
    return true;
  }

  // Sport-specific critical thresholds
  const thresholds = CRITICAL_THRESHOLDS[sportKey];

  // Temperature bounds
  if (thresholds.maxTemp !== undefined && hourWeather.temperature_2m > thresholds.maxTemp) {
    if (sportKey === 'running') {
      return hourWeather.dew_point_2m > 18;
    }
    return true;
  }

  if (thresholds.minTemp !== undefined && hourWeather.temperature_2m < thresholds.minTemp) {
    return true;
  }

  // Precipitation
  if (thresholds.maxPrecip !== undefined && hourWeather.precipitation > thresholds.maxPrecip) {
    return true;
  }

  // Wind gust upper bound (cycling, kayaking, surfing)
  if (thresholds.maxWindGust !== undefined && hourWeather.wind_gusts_10m > thresholds.maxWindGust) {
    return true;
  }

  // Wind gust lower bound (kitesurfing, windsurfing)
  if (thresholds.minWindGust !== undefined && hourWeather.wind_gusts_10m < thresholds.minWindGust) {
    return true;
  }

  // Alternative wind upper bound
  if (thresholds.maxWindGustAlt !== undefined && hourWeather.wind_gusts_10m > thresholds.maxWindGustAlt) {
    return true;
  }

  return false;
}
