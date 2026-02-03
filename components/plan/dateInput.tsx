import { Text } from '@/components/ui/text';
import React from 'react';
import { Pressable, View } from 'react-native';

export function DateInput({
  label = 'Date',
  value,
  onPress,
}: {
  label?: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View className="mb-4">
      <Text
        className="mb-1 text-[14px] text-typography-700"
        style={{ fontFamily: 'Roboto-Medium' }}
      >
        {label} <Text className="text-error-500">*</Text>
      </Text>
      <Pressable
        onPress={onPress}
        className="rounded-lg border border-outline-200 bg-white px-4 py-3"
      >
        <Text className="text-[14px] text-typography-900" style={{ fontFamily: 'Roboto-Regular' }}>
          {value}
        </Text>
      </Pressable>
    </View>
  );
}
