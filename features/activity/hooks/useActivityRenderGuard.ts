import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { ActivityParams } from './useActivityDetail';

interface UseActivityRenderGuardArgs {
  params: ActivityParams;
  isLoading: boolean;
  hasData: boolean;
}

export function useActivityRenderGuard({ params, isLoading, hasData }: UseActivityRenderGuardArgs) {
  const paramsKey = useMemo(
    () =>
      JSON.stringify({
        activity: params.activity ?? null,
        status: params.status ?? null,
        date: params.date ?? null,
        activityId: params.activityId ?? null,
        lat: params.lat ?? null,
        lng: params.lng ?? null,
        locationName: params.locationName ?? null,
        useWeatherPrefs: params.useWeatherPrefs ?? null,
        rainTolerance: params.rainTolerance ?? null,
        tempMin: params.tempMin ?? null,
        tempMax: params.tempMax ?? null,
        windLevel: params.windLevel ?? null,
        metricSystem: params.metricSystem ?? null,
      }),
    [
      params.activity,
      params.status,
      params.date,
      params.activityId,
      params.lat,
      params.lng,
      params.locationName,
      params.useWeatherPrefs,
      params.rainTolerance,
      params.tempMin,
      params.tempMax,
      params.windLevel,
      params.metricSystem,
    ]
  );

  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(true);

  useLayoutEffect(() => {
    setIsRouteTransitioning(true);
  }, [paramsKey]);

  useEffect(() => {
    if (!isLoading && hasData) {
      setReadyKey(paramsKey);
      setIsRouteTransitioning(false);
    }
  }, [isLoading, hasData, paramsKey]);

  return {
    showSkeleton: isRouteTransitioning || isLoading || readyKey !== paramsKey,
  };
}
