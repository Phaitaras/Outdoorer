import { Text } from '@/components/ui/text';
import { WEATHER_CODE_TO_DESCRIPTION, WEATHER_CODE_TO_ICON } from '@/constants/weather';
import { type WeatherData } from '@/features/weather';
import * as LucideIcons from 'lucide-react-native';
import React, { useMemo } from 'react';
import { View } from 'react-native';

export function CurrentWeatherCard({ weather }: { weather?: WeatherData }) {
  if (!weather) {
    return (
      <View>
        <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1">
          <Text className="text-typography-500">Fetching Weather Data...</Text>
        </View>
      </View>
    );
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

  const currentIcon = WEATHER_CODE_TO_ICON[weather.current.weathercode] || 'cloud';
  const CurrentIcon = getIconComponent(currentIcon);
  const currentDescription = WEATHER_CODE_TO_DESCRIPTION[weather.current.weathercode] || 'Unknown';

  // Prefer API-provided next6 hours; fallback to slicing dayHours from current time
  const hourlyData = useMemo(() => {
    const source = (weather.next6 && weather.next6.length > 0)
      ? weather.next6
      : (weather.dayHours ?? []);

    // If using dayHours, find next 6 based on current time
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
      : source;

    return list.map((hour) => {
      const time = new Date(hour.time);
      const h = time.getHours().toString().padStart(2, '0');
      const iconName = WEATHER_CODE_TO_ICON[hour.weathercode] || 'cloud';
      const Icon = getIconComponent(iconName);
      const t = Math.round(hour.temperature_2m);
      return { h, Icon, t };
    });
  }, [weather.next6, weather.dayHours, weather.units]);

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
            {Math.round(weather.current.temperature_2m)}{weather.units === 'imperial' ? '°f' : '°c'}
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
