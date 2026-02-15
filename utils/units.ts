import type { MetricSystem } from '@/features/profile/types';

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert km/h to mph
 */
export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

/**
 * Convert mph to km/h
 */
export function mphToKmh(mph: number): number {
  return mph / 0.621371;
}

/**
 * Convert mm to inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4;
}

/**
 * Convert inches to mm
 */
export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

/**
 * Format temperature with unit based on metric system
 * @param celsius - Temperature in Celsius
 * @param system - 'metric' or 'imperial'
 * @param decimals - Number of decimal places (default: 0)
 */
export function formatTemp(celsius: number, system: MetricSystem, decimals: number = 0): string {
  if (system === 'imperial') {
    const fahrenheit = celsiusToFahrenheit(celsius);
    return `${Math.round(fahrenheit * Math.pow(10, decimals)) / Math.pow(10, decimals)}°F`;
  }
  return `${Math.round(celsius * Math.pow(10, decimals)) / Math.pow(10, decimals)}°C`;
}

/**
 * Format wind speed with unit based on metric system
 * @param kmh - Wind speed in km/h
 * @param system - 'metric' or 'imperial'
 * @param decimals - Number of decimal places (default: 0)
 */
export function formatSpeed(kmh: number, system: MetricSystem, decimals: number = 0): string {
  if (system === 'imperial') {
    const mph = kmhToMph(kmh);
    return `${Math.round(mph * Math.pow(10, decimals)) / Math.pow(10, decimals)} mph`;
  }
  return `${Math.round(kmh * Math.pow(10, decimals)) / Math.pow(10, decimals)} km/h`;
}

/**
 * Format precipitation with unit based on metric system
 * @param mm - Precipitation in millimeters
 * @param system - 'metric' or 'imperial'
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatPrecip(mm: number, system: MetricSystem, decimals: number = 1): string {
  if (system === 'imperial') {
    const inches = mmToInches(mm);
    return `${Math.round(inches * Math.pow(10, decimals)) / Math.pow(10, decimals)} in`;
  }
  return `${Math.round(mm * Math.pow(10, decimals)) / Math.pow(10, decimals)} mm`;
}

/**
 * Get temperature unit suffix
 */
export function getTempUnitSuffix(system: MetricSystem): string {
  return system === 'imperial' ? '°F' : '°C';
}

/**
 * Get speed unit suffix
 */
export function getSpeedUnitSuffix(system: MetricSystem): string {
  return system === 'imperial' ? 'mph' : 'km/h';
}

/**
 * Get precipitation unit suffix
 */
export function getPrecipUnitSuffix(system: MetricSystem): string {
  return system === 'imperial' ? 'in' : 'mm';
}

/**
 * Generate temperature picker values for metric system (-10 to 30°C)
 */
export const TEMP_VALUES_METRIC = Array.from({ length: 41 }, (_, i) => -10 + i);

/**
 * Generate temperature picker values for imperial system (14 to 86°F)
 * Corresponds roughly to -10 to 30°C
 */
export const TEMP_VALUES_IMPERIAL = Array.from({ length: 73 }, (_, i) => 14 + i);

/**
 * Get temperature values for the given metric system
 */
export function getTempValues(system: MetricSystem): number[] {
  return system === 'imperial' ? TEMP_VALUES_IMPERIAL : TEMP_VALUES_METRIC;
}
