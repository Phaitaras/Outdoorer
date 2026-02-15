import type { MetricSystem } from '@/features/profile/types';
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemp, getTempValues } from '@/utils/units';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Pressable, View } from 'react-native';

export function TemperaturePickerModal({
  visible,
  selectedValue,
  onValueChange,
  onClose,
  metricSystem = 'metric',
}: {
  visible: boolean;
  selectedValue: number;
  onValueChange: (value: number) => void;
  onClose: () => void;
  metricSystem?: MetricSystem;
}) {
  if (!visible) return null;

  const tempValues = getTempValues(metricSystem);
  
  // convert selectedValue from celsius to display format
  const displayValue = metricSystem === 'imperial' ? celsiusToFahrenheit(selectedValue) : selectedValue;

  const handlePickerChange = (value: number) => {
    // convert selected value back to celsius for internal storage
    const celsiusValue = metricSystem === 'imperial' ? fahrenheitToCelsius(value) : value;
    onValueChange(Math.round(celsiusValue));
  };

  return (
    <View className="absolute inset-0 justify-end">
      <Pressable
        className="absolute inset-0 bg-[rgba(15,15,15,0.2)]"
        onPress={onClose}
      />
      <View className="bg-white p-4">
        <Picker
          selectedValue={displayValue}
          onValueChange={handlePickerChange}
        >
          {tempValues.map((t) => (
            <Picker.Item key={t} label={formatTemp(metricSystem === 'imperial' ? fahrenheitToCelsius(t) : t, metricSystem)} value={t} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
