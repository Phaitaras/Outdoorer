import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Pressable, View } from 'react-native';
import { RAIN_OPTIONS, SENTIMENT_COLORS, type RainValue } from './constants';

export function WeatherPreferencesCard({
  rainTolerance,
  onRainToleranceChange,
  tempMin,
  tempMax,
  onTempMinPress,
  onTempMaxPress,
  windLevel,
  onWindLevelChange,
}: {
  rainTolerance: RainValue;
  onRainToleranceChange: (value: RainValue) => void;
  tempMin: number;
  tempMax: number;
  onTempMinPress: () => void;
  onTempMaxPress: () => void;
  windLevel: number;
  onWindLevelChange: (value: number) => void;
}) {
  const toleranceIndex = RAIN_OPTIONS.findIndex((o) => o.value === rainTolerance);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-soft-1 gap-5">
      <View>
        <Text
          className="mb-2 text-[13px] text-typography-700"
          style={{ fontFamily: 'Roboto-Medium' }}
        >
          Rain Tolerance
        </Text>

        <View className="flex-row justify-between">
          {RAIN_OPTIONS.map((option) => {
            const isSelected = rainTolerance === option.value;
            const optionIndex = option.level;
            const isWithinTolerance = optionIndex <= toleranceIndex;

            const sentimentKey = option.sentiment as keyof typeof SENTIMENT_COLORS;
            const sentimentColor = SENTIMENT_COLORS[sentimentKey];

            const baseBorder = '#D4D4D8';
            const baseLabel = '#9CA3AF';

            const borderColor = isWithinTolerance ? sentimentColor : baseBorder;
            const backgroundColor = isSelected
              ? `${sentimentColor}33`
              : isWithinTolerance
              ? `${sentimentColor}20`
              : '#FFFFFF';
            const iconColor = isWithinTolerance ? sentimentColor : baseBorder;
            const labelColor = isWithinTolerance ? sentimentColor : baseLabel;

            return (
              <Pressable
                key={option.value}
                onPress={() => onRainToleranceChange(option.value)}
                className="flex-1 mx-[2px] items-center"
              >
                <View
                  className="w-12 h-12 rounded-full border items-center justify-center mb-1"
                  style={{
                    borderColor,
                    borderWidth: isSelected ? 2 : 1,
                    backgroundColor,
                  }}
                >
                  <option.Icon size={22} color={iconColor} strokeWidth={2} />
                </View>

                <Text
                  className="text-center text-[11px]"
                  style={{
                    fontFamily: 'Roboto-Medium',
                    color: labelColor,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <View className="flex-row justify-between mb-1">
          <Text
            className="text-[13px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Temperature
          </Text>
          <Text
            className="text-[13px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            {tempMin}°C – {tempMax}°C
          </Text>
        </View>

        <View className="flex-row mt-2">
          <View className="flex-1 mr-2">
            <Text
              className="text-[12px] text-typography-600 mb-1"
              style={{ fontFamily: 'Roboto-Regular' }}
            >
              Min
            </Text>
            <Pressable
              onPress={onTempMinPress}
              className="rounded-2xl bg-[#F4F4F5] px-4 py-3 items-center justify-center"
            >
              <Text className="text-[14px]" style={{ fontFamily: 'Roboto-Medium' }}>
                {tempMin}°C
              </Text>
            </Pressable>
          </View>

          <View className="flex-1 ml-2">
            <Text
              className="text-[12px] text-typography-600 mb-1"
              style={{ fontFamily: 'Roboto-Regular' }}
            >
              Max
            </Text>
            <Pressable
              onPress={onTempMaxPress}
              className="rounded-2xl bg-[#F4F4F5] px-4 py-3 items-center justify-center"
            >
              <Text className="text-[14px]" style={{ fontFamily: 'Roboto-Medium' }}>
                {tempMax}°C
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View>
        <View className="flex-row justify-between mb-2">
          <Text
            className="text-[13px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Wind
          </Text>
          <Text className="text-[12px] text-typography-600">
            {['Low', 'Moderate', 'High'][windLevel]}
          </Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={2}
          step={1}
          value={windLevel}
          onValueChange={(val) => onWindLevelChange(Math.round(val))}
          style={{ width: '100%', height: 32 }}
          minimumTrackTintColor="#FFAE00"
          maximumTrackTintColor="#D4D4D8"
          thumbTintColor="#FFFFFF"
        />

        <View className="flex-row justify-between mt-1">
          <Text className="text-[11px] text-typography-500">Low</Text>
          <Text className="text-[11px] text-typography-500">Moderate</Text>
          <Text className="text-[11px] text-typography-500">High</Text>
        </View>
      </View>
    </View>
  );
}
