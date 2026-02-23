import type { Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { StatusBadge } from '../statusBadge';

export function HourlyTable({ selectedHour, sentiment, score, rows }: { selectedHour: string; sentiment?: Sentiment; score?: number; rows: [string, string, string, string][] }) {
  return (
    <View>
      <View className="bg-white rounded-2xl px-4 pt-3 pb-2 shadow-soft-1 border border-outline-100">
        <View className="flex-row items-center justify-between pb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg" style={{ fontFamily: 'Roboto-Medium' }}>{selectedHour}</Text>
            <StatusBadge value={sentiment as Sentiment} />
          </View>
          <Text className="text-md text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>{score !== undefined ? `${Math.round(score)} / 100` : '-'}</Text>
        </View>

        {rows.map(([k1, v1, k2, v2]) => (
          <View key={k1} className="flex-row justify-evenly py-1 border-b border-outline-100 last:border-b-0">
            <View className="w-[48%] p-2 mr-2 bg-gray-100 rounded-lg">
              <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>{k1}</Text>
              <Text className="text-[13px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{v1}</Text>
            </View>
            <View className="w-[48%] p-2 bg-gray-100 rounded-lg">
              <Text className="text-[11px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>{k2}</Text>
              <Text className="text-[13px] text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>{v2}</Text>
            </View>
          </View>
        ))}
      </View>
      <View className="mt-2 flex self-end">
        <Text className="text-xs text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>Weather data by Open-Meteo.com</Text>
      </View>
    </View>
  );
}
