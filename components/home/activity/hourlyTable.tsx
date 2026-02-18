import type { Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export function HourlyTable({ selectedHour, sentiment, score, rows }: { selectedHour: string; sentiment?: Sentiment; score?: number; rows: [string, string, string, string][] }) {
  return (
    <View>
    <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm" style={{ fontFamily: 'Roboto-Medium' }}>Hourly Window</Text>
        <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
          {selectedHour}
        </Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-outline-100 last:border-b-0">
          <View className="w-1/2 pr-2">
            <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>Condition</Text>
            <Text className="text-[15px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{sentiment}</Text>
          </View>
          <View className="w-1/2 pr-2 items-end">
            <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>Score</Text>
            <Text className="text-[15px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{score !== undefined ? `${Math.round(score)} / 100` : '-'}</Text>
          </View>
        </View>

      {rows.map(([k1, v1, k2, v2]) => (
        <View key={k1} className="flex-row justify-between py-2 border-b border-outline-100 last:border-b-0">
          <View className="w-1/2 pr-2">
            <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>{k1}</Text>
            <Text className="text-[13px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{v1}</Text>
          </View>
          <View className="w-1/2 pl-2 items-end">
            <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>{k2}</Text>
            <Text className="text-[13px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{v2}</Text>
          </View>
        </View>
      ))}
    </View>
      <View className="mt-2 flex self-end">
        <Text className="text-xs text-typography-500" style={{fontFamily: 'Roboto-Regular'}}>Weather data by Open-Meteo.com</Text>
      </View>
    </View>
  );
}
