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

  // Format 6 hours starting from current hour for display (from 24h data)
  const hourlyData = useMemo(() => {
    const currentHour = new Date().getHours();
    return (weather.hours ?? []).slice(currentHour, currentHour + 6).map((hour) => {
      const time = new Date(hour.time);
      const h = time.getHours().toString().padStart(2, '0');
      const iconName = WEATHER_CODE_TO_ICON[hour.weathercode] || 'cloud';
      const Icon = getIconComponent(iconName);
      const t = `${Math.round(hour.temperature_2m)}°`;
      return { h, Icon, t };
    });
  }, [weather.hours]);

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
          <Text className="text-4xl" style={{fontFamily: 'Roboto-Medium'}}>{Math.round(weather.current.temperature_2m)}°c</Text>
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
