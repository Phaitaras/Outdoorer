import { Text } from '@/components/ui/text';
import { ArrowRight as LucideArrowRight } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export function RecommendedWindow({ dateLabel, windowLabel }: { dateLabel: string; windowLabel: string }) {
  return (
    <>
      <Text className="text-sm mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
        {dateLabel}
      </Text>
      <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-3 flex-row items-center justify-between">
        <Text className="text-sm text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>Recommended Window</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm" style={{ fontFamily: 'Roboto-Medium' }}>{windowLabel}</Text>
          <LucideArrowRight size={16} />
        </View>
      </View>
    </>
  );
}
