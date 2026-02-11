import type { Sentiment } from '@/components/home/sentiment';

// Activity type keys (from constants/activities.ts)
export type ActivityKey =
  | 'running'
  | 'cycling'
  | 'hiking'
  | 'rock_climbing'
  | 'kayaking'
  | 'sailing'
  | 'surfing'
  | 'kitesurfing'
  | 'windsurfing'
  | 'generic_sports';

// Weight Table - from Metric doc
// Each sport has weights for: temp, windGust, precip, dewPoint, daylight, marine
export const SPORT_WEIGHTS: Record<ActivityKey, {
  temperature: number;
  windGust: number;
  precipitation: number;
  dewPoint: number;
  daylight: number;
  marine: number;
}> = {
  running: {
    temperature: 0.3,
    windGust: 0.25,
    precipitation: 0.25,
    dewPoint: 0.1,
    daylight: 0.3,
    marine: 0,
  },
  cycling: {
    temperature: 0.25,
    windGust: 0.3,
    precipitation: 0.25,
    dewPoint: 0.1,
    daylight: 0.3,
    marine: 0,
  },
  hiking: {
    temperature: 0.25,
    windGust: 0.25,
    precipitation: 0.25,
    dewPoint: 0.1,
    daylight: 0.3,
    marine: 0,
  },
  rock_climbing: {
    temperature: 0.25,
    windGust: 0.25,
    precipitation: 0.25,
    dewPoint: 0.1,
    daylight: 0.3,
    marine: 0,
  },
  generic_sports: {
    temperature: 0.3,
    windGust: 0.2,
    precipitation: 0.25,
    dewPoint: 0.1,
    daylight: 0.3,
    marine: 0,
  },
  kayaking: {
    temperature: 0.2,
    windGust: 0.3,
    precipitation: 0.2,
    dewPoint: 0.05,
    daylight: 0.1,
    marine: 0.2,
  },
  sailing: {
    temperature: 0.1,
    windGust: 0.35,
    precipitation: 0.15,
    dewPoint: 0.05,
    daylight: 0.1,
    marine: 0.3,
  },
  surfing: {
    temperature: 0.1,
    windGust: 0.2,
    precipitation: 0.1,
    dewPoint: 0.05,
    daylight: 0.1,
    marine: 0.5,
  },
  kitesurfing: {
    temperature: 0.05,
    windGust: 0.35,
    precipitation: 0.1,
    dewPoint: 0.05,
    daylight: 0.1,
    marine: 0.4,
  },
  windsurfing: {
    temperature: 0.05,
    windGust: 0.35,
    precipitation: 0.1,
    dewPoint: 0.05,
    daylight: 0.1,
    marine: 0.4,
  },
};

// Ideal Temperature Ranges (Tlow, Thigh) in Celsius
export const IDEAL_TEMP_RANGES: Record<ActivityKey, { low: number; high: number }> = {
  running: { low: 5, high: 25 },
  cycling: { low: 5, high: 30 },
  hiking: { low: 5, high: 25 },
  rock_climbing: { low: 10, high: 30 },
  generic_sports: { low: 10, high: 28 },
  kayaking: { low: 15, high: 30 },
  sailing: { low: 10, high: 28 },
  surfing: { low: 18, high: 32 },
  kitesurfing: { low: 15, high: 30 },
  windsurfing: { low: 15, high: 30 },
};

// Temperature penalty rates (points per °C)
export const TEMP_PENALTY_RATES = {
  coldRate: 3, // ac in formula
  heatRate: 4, // ah in formula
};

// Wind Gust thresholds (km/h)
export const WIND_GUST_THRESHOLDS = {
  G0: 35, // gust speed where penalty begins (increased from 20 - light breeze is fine)
  G100: 75, // gust speed where penalty reaches 100 (increased from 62)
};

// Precipitation amount thresholds (mm/h)
export const PRECIP_THRESHOLDS = {
  P0: 0.5, // light drizzle threshold (anything below is tolerable)
  P100: 8.0, // very heavy rain (increased from 6.0)
};

// Precipitation probability thresholds (%)
export const PRECIP_PROB_THRESHOLDS = {
  PoP0: 20, // low risk threshold (increased from 10)
  PoP100: 90, // very likely to rain (increased from 80)
};

// Precipitation probability penalty scaling factor
// Reduced from 0.5 to 0.3 - give less weight to probability
export const PRECIP_PROB_LAMBDA = 0.3;

// Dew Point thresholds (°C)
export const DEW_POINT_THRESHOLDS = {
  DP0: 12.8, // comfortable upper bound
  DP100: 18.3, // very muggy
};

// Daylight penalty (points when is_day = 0)
// Reduced to 60 for moderate night penalty impact
export const DAYLIGHT_PENALTY = 60;

// Marine thresholds
export const MARINE_THRESHOLDS = {
  // Wave height (m)
  H0: 0.5,
  H100: 2.0,
  // Wave period (s) - INVERTED: shorter periods are worse
  P0: 10,
  P100: 6,
  // Wind-chop fraction (unitless)
  r0: 0.4,
  r100: 0.8,
  // Ocean current velocity (km/h)
  V0: 3,
  V100: 8,
};

// Marine sub-weights (for combining wave height, period, chop, current)
export const MARINE_SUB_WEIGHTS = {
  height: 0.25,
  period: 0.25,
  chop: 0.25,
  current: 0.25,
};

// Wind-chop epsilon (to avoid division by zero)
export const WIND_CHOP_EPSILON = 0.1;

// Critical weathercodes that trigger automatic POOR rating
// 65: Heavy rain, 67: Heavy freezing rain, 75: Heavy snow, 77: Snow grains
// 85/86: Snow showers, 95/96/99: Thunderstorm variants
export const CRITICAL_WEATHERCODES = [65, 67, 75, 77, 85, 86, 95, 96, 99];

// Global critical threshold - wind gust (km/h)
export const CRITICAL_WIND_GUST = 62; // Beaufort 8 (gale)

// Sport-specific critical thresholds
export const CRITICAL_THRESHOLDS: Record<ActivityKey, {
  maxTemp?: number;
  minTemp?: number;
  maxPrecip?: number;
  maxWindGust?: number;
  minWindGust?: number;
  maxWindGustAlt?: number; // alternative upper bound for some sports
}> = {
  running: {
    maxTemp: 37, // °C (with humidity consideration in safety.ts)
    minTemp: -28, // °C
  },
  cycling: {
    maxWindGust: 70, // km/h (increased from 50 - too restrictive)
  },
  hiking: {},
  rock_climbing: {
    maxPrecip: 2.5, // mm/h (mechanical strength drops 75% when wet)
  },
  generic_sports: {},
  kayaking: {
    maxWindGust: 27.78, // km/h (15 knots)
  },
  sailing: {},
  surfing: {
    maxWindGust: 30, // km/h
  },
  kitesurfing: {
    minWindGust: 19, // km/h
    maxWindGust: 30, // km/h
  },
  windsurfing: {
    minWindGust: 19, // km/h
    maxWindGust: 30, // km/h
  },
};

// Score to Sentiment mapping
export const SCORE_TO_SENTIMENT_MAP: Array<{ min: number; sentiment: Sentiment }> = [
  { min: 90, sentiment: 'GREAT' },
  { min: 75, sentiment: 'GOOD' },
  { min: 60, sentiment: 'FAIR' },
  { min: 45, sentiment: 'BAD' },
  { min: 0, sentiment: 'POOR' },
];

// Filter penalty (flat penalty per violated filter)
// Reduced from 30 to 10 - filters should refine scores, not destroy them
// Base score already penalizes bad weather, so don't double-penalize
export const FILTER_PENALTY = 10;

// Rain filter thresholds - mapping RainValue to max precipitation amount and probability
export const RAIN_FILTER_MAP: Record<string, { Pmax: number; PoPmax: number }> = {
  clear: { Pmax: 0.1, PoPmax: 15 },
  drizzle: { Pmax: 0.3, PoPmax: 100 },
  light: { Pmax: 1.0, PoPmax: 100 },
  moderate: { Pmax: 2.5, PoPmax: 100 },
  heavy: { Pmax: 6.0, PoPmax: 100 },
};

// Wind filter thresholds - indexed by windLevel (0, 1, 2)
export const WIND_FILTER_MAP = [
  25,  // Low
  40,  // Moderate
  60,  // High
];
