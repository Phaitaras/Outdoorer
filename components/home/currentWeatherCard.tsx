import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CloudDrizzle, Sun, Cloud } from 'lucide-react-native';

export function CurrentWeatherCard() {
  const hours = [
    { h: '10', I: Cloud,  t: '11°' },
    { h: '11', I: Cloud,  t: '12°' },
    { h: '12', I: Sun,    t: '13°' },
    { h: '13', I: Sun,    t: '14°' },
    { h: '14', I: Sun,    t: '15°' },
    { h: '15', I: Sun,    t: '15°' },
  ];

  return (
    <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1 border border-outline-100">
      <View className="flex-row items-center">
        <View className="flex-row items-center gap-4 flex-1">
          <CloudDrizzle size={32} />
          <View>
            <Text className="text-sm text-typography-600" style={{fontFamily: 'Roboto-Medium'}}>Current</Text>
            <Text className="text-lg text-typography-600" style={{fontFamily: 'Roboto-SemiBold'}}>Drizzle</Text>
          </View>
        </View>
        <Text className="text-4xl" style={{fontFamily: 'Roboto-Medium'}}>10°c</Text>
      </View>

      <View className="flex-row items-center gap-4 mt-4 justify-between">
        {hours.map(({ h, I, t }, i) => (
          <View key={i} className="items-center">
            <Text className="text-sm text-typography-500" style={{fontFamily: 'Roboto-Regular'}}>{h}</Text>
            <I size={18} />
            <Text className="text-sm text-typography-600 mt-1" style={{fontFamily: 'Roboto-Regular'}}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
