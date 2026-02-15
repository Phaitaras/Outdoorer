import type { Sentiment } from '@/components/home/sentiment';
import type { HourWeather } from '@/features/weather';
import type { ActivityKey } from './constants';
import {
    FILTER_PENALTY,
    IDEAL_TEMP_RANGES,
    RAIN_FILTER_MAP,
    SCORE_TO_SENTIMENT_MAP,
    SPORT_WEIGHTS,
    WIND_FILTER_MAP,
} from './constants';
import {
    combinedPrecipPenalty,
    daylightPenalty,
    dewPointPenalty,
    marinePenalty,
    temperaturePenalty,
    windGustPenalty,
} from './penalties';
import { isCritical } from './safety';

/**
 * Filter state type (from useFilterState)
 */
export type FilterState = {
  useWeatherPrefs: boolean;
  rainTolerance: 'clear' | 'drizzle' | 'light' | 'moderate' | 'heavy';
  tempMin: number;
  tempMax: number;
  windLevel: number; // 0, 1, 2
};

/**
 * Compute base score (0-100) using penalty functions
 * Sbase = 100 - Σ(wᵢ × fᵢ(xᵢ))
 */
export function computeBaseScore(hourWeather: HourWeather, sportKey: ActivityKey): number {
  const weights = SPORT_WEIGHTS[sportKey];
  const tempRange = IDEAL_TEMP_RANGES[sportKey];

  // Temperature penalty
  const tempPenalty = temperaturePenalty(
    hourWeather.temperature_2m,
    tempRange.low,
    tempRange.high
  );

  // Wind gust penalty
  const windPenalty = windGustPenalty(hourWeather.wind_gusts_10m);

  // Precipitation penalty (amount + probability)
  const precipPenalty = combinedPrecipPenalty(
    hourWeather.precipitation,
    hourWeather.precipitation_probability
  );

  // Dew point penalty
  const dewPenalty = dewPointPenalty(hourWeather.dew_point_2m);

  // Daylight penalty
  const daylightPen = daylightPenalty(hourWeather.is_day);

  // Marine penalty (only for water sports with non-zero marine weight)
  let marinePen = 0;
  if (weights.marine > 0) {
    marinePen = marinePenalty(
      hourWeather.wave_height,
      hourWeather.wave_period,
      hourWeather.wind_wave_height,
      hourWeather.ocean_current_velocity
    );
  }

  // Weighted sum of penalties
  const totalPenalty =
    weights.temperature * tempPenalty +
    weights.windGust * windPenalty +
    weights.precipitation * precipPenalty +
    weights.dewPoint * dewPenalty +
    weights.daylight * daylightPen +
    weights.marine * marinePen;

  // Debug multiple hours to see penalty breakdown across day
  const hour = hourWeather.time.slice(11, 13);
  if (hour === '00' || hour === '06' || hour === '12' || hour === '18') {
    console.log(`[SCORING PENALTIES] ${sportKey} at ${hourWeather.time}:`, {
      temp: hourWeather.temperature_2m,
      windGust: hourWeather.wind_gusts_10m,
      precip: hourWeather.precipitation,
      precipProb: hourWeather.precipitation_probability,
      isDay: hourWeather.is_day,
      tempPenalty: tempPenalty.toFixed(1),
      windPenalty: windPenalty.toFixed(1),
      precipPenalty: precipPenalty.toFixed(1),
      daylightPen: daylightPen.toFixed(1),
      totalPenalty: totalPenalty.toFixed(1),
    });
  }

  // Base score = 100 - total penalty, clamped to [0, 100]
  return Math.max(0, Math.min(100, 100 - totalPenalty));
}

/**
 * Compute filter penalty (0, 10, 20, or 30)
 * Each violated filter adds 10 points
 */
export function computeFilterPenalty(
  hourWeather: HourWeather,
  filters: FilterState | null
): number {
  if (!filters || !filters.useWeatherPrefs) {
    return 0;
  }

  let penalty = 0;
  const violations: string[] = [];

  // Rain tolerance filter
  const rainThresholds = RAIN_FILTER_MAP[filters.rainTolerance];
  if (
    hourWeather.precipitation > rainThresholds.Pmax ||
    hourWeather.precipitation_probability > rainThresholds.PoPmax
  ) {
    penalty += FILTER_PENALTY;
    violations.push(
      `rain(${hourWeather.precipitation.toFixed(1)}mm>${rainThresholds.Pmax}mm OR ${hourWeather.precipitation_probability}%>${rainThresholds.PoPmax}%)`
    );
  }

  // Temperature filter
  if (
    hourWeather.temperature_2m < filters.tempMin ||
    hourWeather.temperature_2m > filters.tempMax
  ) {
    penalty += FILTER_PENALTY;
    violations.push(
      `temp(${hourWeather.temperature_2m.toFixed(1)}°C not in ${filters.tempMin}-${filters.tempMax}°C)`
    );
  }

  // Wind filter
  const windMax = WIND_FILTER_MAP[filters.windLevel] ?? 60;
  if (hourWeather.wind_gusts_10m > windMax) {
    penalty += FILTER_PENALTY;
    violations.push(`wind(${hourWeather.wind_gusts_10m.toFixed(1)}km/h>${windMax}km/h)`);
  }

  // Log violations for debugging
  const hour = hourWeather.time.slice(11, 13);
  if ((hour === '00' || hour === '06' || hour === '12' || hour === '18') && violations.length > 0) {
    console.log(`[FILTER VIOLATIONS] at ${hourWeather.time}:`, violations.join(', '));
  }

  return penalty;
}

/**
 * Compute final score with critical override and filter penalty
 * Sfinal = max(0, Sbase - filter_penalty)
 * If critical conditions, return 0
 */
export function computeFinalScore(
  hourWeather: HourWeather,
  sportKey: ActivityKey,
  filters: FilterState | null = null
): number {
  // Critical override: force score to 0 (POOR)
  const critical = isCritical(hourWeather, sportKey);
  if (critical) {
    console.log(`[SCORING] CRITICAL for ${sportKey} at ${hourWeather.time}:`, {
      weathercode: hourWeather.weathercode,
      temp: hourWeather.temperature_2m,
      windGust: hourWeather.wind_gusts_10m,
      precip: hourWeather.precipitation,
    });
    return 0;
  }

  const baseScore = computeBaseScore(hourWeather, sportKey);
  const filterPenalty = computeFilterPenalty(hourWeather, filters);
  const finalScore = Math.max(0, baseScore - filterPenalty);

  // Debug multiple hours to see scores across day
  const hour = hourWeather.time.slice(11, 13);
  if (hour === '00' || hour === '06' || hour === '12' || hour === '18') {
    console.log(`[SCORING] ${sportKey} at ${hourWeather.time}:`, {
      baseScore: baseScore.toFixed(1),
      filterPenalty,
      finalScore: finalScore.toFixed(1),
      temp: hourWeather.temperature_2m,
      windGust: hourWeather.wind_gusts_10m,
      precip: hourWeather.precipitation,
      precipProb: hourWeather.precipitation_probability,
      isDay: hourWeather.is_day,
    });
  }

  return finalScore;
}

/**
 * Convert score (0-100) to Sentiment
 */
export function scoreToSentiment(score: number): Sentiment {
  for (const { min, sentiment } of SCORE_TO_SENTIMENT_MAP) {
    if (score >= min) {
      return sentiment;
    }
  }
  return 'POOR';
}

/**
 * Compute hourly sentiments for a full day (24 hours)
 * Returns array of { hour, sentiment, score }
 */
export function computeHourlySentiments(
  dayHours: HourWeather[],
  sportKey: ActivityKey,
  filters: FilterState | null = null
): Array<{ hour: string; sentiment: Sentiment; score: number }> {
  return dayHours.map((hourWeather) => {
    const score = computeFinalScore(hourWeather, sportKey, filters);
    const sentiment = scoreToSentiment(score);
    // Extract hour in HH:MM format
    const hour = hourWeather.time.slice(11, 16); // "YYYY-MM-DDTHH:MM" -> "HH:MM"
    return { hour, sentiment, score };
  });
}
