import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

export function DatePickerModal({
  visible,
  value,
  onChange,
  onClose,
}: {
  visible: boolean;
  value: Date;
  onChange: (event: DateTimePickerEvent, selected?: Date) => void;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end">
      <Pressable
        className="absolute inset-0 bg-[rgba(15,15,15,0.2)]"
        onPress={onClose}
      />
      <View className="bg-white p-4 items-center">
        <DateTimePicker
          mode="date"
          value={value}
          onChange={onChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      </View>
    </View>
  );
}
