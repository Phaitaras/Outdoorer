import { Text } from '@/components/ui/text';
import { CalendarDays, Clock } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export function DateTimePickers({
  date,
  timeRangeLabel,
  onDatePress,
  onTimePress,
}: {
  date: string;
  timeRangeLabel: string;
  onDatePress: () => void;
  onTimePress: () => void;
}) {
  return (
    <>
      <View className="mb-4">
        <Text
          className="mb-1 text-[14px] text-typography-700"
          style={{ fontFamily: 'Roboto-Medium' }}
        >
          Date <Text className="text-error-500">*</Text>
        </Text>

        <Pressable
          onPress={onDatePress}
          className="rounded-lg bg-white border border-outline-200 px-3 py-3 flex-row items-center justify-between"
        >
          <Text
            className="text-[14px] text-typography-800"
            style={{ fontFamily: 'Roboto-Regular' }}
          >
            {date}
          </Text>
          <CalendarDays size={18} color="#444" />
        </Pressable>
      </View>

      <View className="mb-6">
        <Text
          className="mb-1 text-[14px] text-typography-700"
          style={{ fontFamily: 'Roboto-Medium' }}
        >
          Time <Text className="text-error-500">*</Text>
        </Text>

        <Pressable
          onPress={onTimePress}
          className="rounded-lg bg-white border border-outline-200 px-3 py-3 flex-row items-center justify-between"
        >
          <Text
            className="text-[14px] text-typography-800"
            style={{ fontFamily: 'Roboto-Regular' }}
          >
            {timeRangeLabel}
          </Text>
          <Clock size={18} color="#444" />
        </Pressable>
      </View>
    </>
  );
}
