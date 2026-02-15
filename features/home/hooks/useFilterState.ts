import { type RainValue } from '@/components/plan/constants';
import { useState } from 'react';

export function useFilterState() {
  const [showFilters, setShowFilters] = useState(false);
  const [useWeatherPrefs, setUseWeatherPrefs] = useState(false);
  const [rainTolerance, setRainTolerance] = useState<RainValue>('light');
  const [tempMin, setTempMin] = useState<number>(8);
  const [tempMax, setTempMax] = useState<number>(28);
  const [windLevel, setWindLevel] = useState<number>(1);
  const [tempPicker, setTempPicker] = useState<'min' | 'max' | null>(null);

  const handleTempValueChange = (value: number) => {
    if (tempPicker === 'min') {
      setTempMin(Math.min(value, tempMax - 1));
    } else if (tempPicker === 'max') {
      setTempMax(Math.max(value, tempMin + 1));
    }
  };

  const resetFilters = () => {
    setUseWeatherPrefs(false);
    setRainTolerance('light');
    setTempMin(8);
    setTempMax(28);
    setWindLevel(1);
    setShowFilters(false);
  };

  return {
    showFilters,
    setShowFilters,
    useWeatherPrefs,
    setUseWeatherPrefs,
    rainTolerance,
    setRainTolerance,
    tempMin,
    setTempMin,
    tempMax,
    setTempMax,
    windLevel,
    setWindLevel,
    tempPicker,
    setTempPicker,
    handleTempValueChange,
    resetFilters,
  };
}
