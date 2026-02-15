import type { Sentiment } from '@/components/home/sentiment';
import type { WeatherData } from '@/features/weather';
import { findRecommendedWindow, type HourBar } from '@/utils/activity';
import { useMemo } from 'react';
import type { ActivityKey, FilterState } from '../calculator';
import { computeHourlySentiments } from '../calculator';

export type ActivityScoreResult = {
  status: Sentiment; // Current/overall sentiment
  next6: Sentiment[]; // Sentiments for next 6 hours
  windowText: string; // Recommended window time range (e.g., "9:00 - 15:00")
};

/**
 * Hook to compute activity scores for all activities
 * @param weatherData - Weather data (24h + next6)
 * @param activityTypes - Array of activity type keys (e.g., ['running', 'cycling'])
 * @param filters - Optional filter state (rain, temp, wind preferences)
 * @returns Map of activity key -> score results
 */
export function useActivityScoring(
  weatherData: WeatherData | undefined | null,
  activityTypes: string[],
  filters: FilterState | null = null
): Map<string, ActivityScoreResult> {
  return useMemo(() => {
    const results = new Map<string, ActivityScoreResult>();

    if (!weatherData) {
      return results;
    }

    for (const activityKey of activityTypes) {
      // Compute sentiments for next 6 hours (for card display)
      const next6Sentiments = computeHourlySentiments(
        weatherData.next6,
        activityKey as ActivityKey,
        filters
      );

      const next6 = next6Sentiments.map((h) => h.sentiment);
      const status = next6[0] ?? 'POOR'; // Current status is first hour

      // Compute sentiments for full 24h (for recommended window)
      const dayHoursSentiments = computeHourlySentiments(
        weatherData.dayHours,
        activityKey as ActivityKey,
        filters
      );

      // Build HourBar array for findRecommendedWindow
      const hourBars: HourBar[] = dayHoursSentiments.map((h) => ({
        hour: h.hour,
        sentiment: h.sentiment,
        score: h.score,
      }));

      // Find recommended window
      const { start, end } = findRecommendedWindow(hourBars);
      const windowText =
        hourBars.length > 0 ? `${hourBars[start].hour} - ${hourBars[end].hour}` : 'N/A';

      results.set(activityKey, {
        status,
        next6,
        windowText,
      });
    }

    return results;
  }, [weatherData, activityTypes, filters]);
}
