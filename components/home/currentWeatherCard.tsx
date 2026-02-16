import { CurrentWeatherCardSkeleton } from '@/components/home/currentWeatherCardSkeleton';
import { Text } from '@/components/ui/text';
import { WEATHER_CODE_TO_DESCRIPTION, WEATHER_CODE_TO_ICON } from '@/constants/weather';
import type { MetricSystem } from '@/features/profile/types';
import type { WeatherData } from '@/features/weather';
import { celsiusToFahrenheit, formatTemp } from '@/utils/units';
import * as LucideIcons from 'lucide-react-native';
import React, { useMemo } from 'react';
import { View } from 'react-native';

export function CurrentWeatherCard({ 
  weather, 
  isLoading, 
  error,
  metricSystem = 'metric'
}: { 
  weather?: WeatherData;
  isLoading?: boolean;
  error?: Error | null;
  metricSystem?: MetricSystem;
}) {
  if (error) {
    console.error('Weather card error:', error);
    return (
      <View>
        <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1">
          <Text className="text-typography-500">
            Error: {error.message?.substring(0, 100) || 'Unknown error'}
          </Text>
        </View>
      </View>
    );
  }

  if (isLoading || !weather) {
    return <CurrentWeatherCardSkeleton />;
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ size: number }>> = {
      'sun': LucideIcons.Sun,
      'cloud': LucideIcons.Cloud,
      'cloud-sun': LucideIcons.CloudSun,
      'cloud-drizzle': LucideIcons.CloudDrizzle,
      'cloud-fog': LucideIcons.CloudFog,
      'cloud-rain': LucideIcons.CloudRain,
      'cloud-snow': LucideIcons.CloudSnow,
      'cloud-lightning': LucideIcons.CloudLightning,
    };
    return iconMap[iconName] || LucideIcons.Cloud;
  };

  if (!weather.current) {
    return (
      <View>
        <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1">
          <Text className="text-typography-500">Current weather not available for future dates.</Text>
        </View>
      </View>
    );
  }

  const currentIcon = WEATHER_CODE_TO_ICON[weather.current.weathercode] || 'cloud';
  const CurrentIcon = getIconComponent(currentIcon);
  const currentDescription = WEATHER_CODE_TO_DESCRIPTION[weather.current.weathercode] || 'Unknown';

  // use next 6hours from API, fallback to slicing dayHours from current time
  const hourlyData = useMemo(() => {
    // start with current hour
    const currentTime = new Date();
    const currentHour = currentTime.getHours().toString().padStart(2, '0');
    const currentIconName = weather.current ? WEATHER_CODE_TO_ICON[weather.current.weathercode] || 'cloud' : 'cloud';
    const CurrentIcon = getIconComponent(currentIconName);
    const currentTempCelsius = weather.current ? weather.current.temperature_2m : 0;
    const currentTemp = metricSystem === 'imperial' ? Math.round(celsiusToFahrenheit(currentTempCelsius)) : Math.round(currentTempCelsius);

    // Display as current hour
    const result = [
      { h: currentHour, Icon: CurrentIcon, t: currentTemp },
    ];

    // next 5 hours (skip any that match current hour)
    const source = (weather.next6 && weather.next6.length > 0)
      ? weather.next6
      : (weather.dayHours ?? []);

    const list = (source === weather.dayHours)
      ? (() => {
          const now = Date.now();
          const out: typeof weather.dayHours = [];
          for (const h of weather.dayHours) {
            const t = new Date(h.time).getTime();
            if (t >= now - 30 * 60 * 1000) {
              out.push(h);
              if (out.length >= 6) break;
            }
          }
          return out;
        })()
      : source.slice(0, 6);

    const hourlyItems = list
      .filter((hour: typeof weather.dayHours[0]) => {
        const time = new Date(hour.time);
        const h = time.getHours().toString().padStart(2, '0');
        return h !== currentHour;
      })
      .slice(0, 5)
      .map((hour: typeof weather.dayHours[0]) => {
        const time = new Date(hour.time);
        const h = time.getHours().toString().padStart(2, '0');
        const iconName = WEATHER_CODE_TO_ICON[hour.weathercode] || 'cloud';
        const Icon = getIconComponent(iconName);
        const t = metricSystem === 'imperial' ? Math.round(celsiusToFahrenheit(hour.temperature_2m)) : Math.round(hour.temperature_2m);
        return { h, Icon, t };
      });

    return [...result, ...hourlyItems];
  }, [weather.current, weather.next6, weather.dayHours, weather.units, metricSystem, Math.floor(Date.now() / 3600000)]);

  return (
    <View>
      <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1">
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-4 flex-1">
            <CurrentIcon size={32} />
            <View>
              <Text className="text-sm text-typography-600" style={{fontFamily: 'Roboto-Medium'}}>Current</Text>
              <Text className="text-lg text-typography-600" style={{fontFamily: 'Roboto-SemiBold'}}>{currentDescription}</Text>
            </View>
          </View>
          <Text className="text-4xl" style={{fontFamily: 'Roboto-Medium'}}>
            {formatTemp(weather.current.temperature_2m, metricSystem)}
          </Text>
        </View>

        <View className="flex-row items-center gap-4 mt-4 justify-between">
          {hourlyData.map(({ h, Icon, t }, i) => (
            <View key={i} className="items-center">
              <Text className="text-sm text-typography-500" style={{fontFamily: 'Roboto-Regular'}}>{h}</Text>
              <Icon size={18} />
              <Text className="text-sm text-typography-600 mt-1" style={{fontFamily: 'Roboto-Regular'}}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
