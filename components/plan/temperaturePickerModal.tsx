import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Pressable, View } from 'react-native';
import { TEMP_VALUES } from './constants';

export function TemperaturePickerModal({
  visible,
  selectedValue,
  onValueChange,
  onClose,
}: {
  visible: boolean;
  selectedValue: number;
  onValueChange: (value: number) => void;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end">
      <Pressable
        className="absolute inset-0 bg-[rgba(15,15,15,0.2)]"
        onPress={onClose}
      />
      <View className="bg-white p-4">
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          {TEMP_VALUES.map((t) => (
            <Picker.Item key={t} label={`${t}°C`} value={t} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
