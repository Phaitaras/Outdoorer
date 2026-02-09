import { type RainValue } from '@/components/plan/constants';
import { LocationInput } from '@/components/plan/locationInput';
import { WeatherPreferencesCard } from '@/components/plan/weatherPreferencesCard';
import { Button, ButtonText } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

type TempPickerMode = 'min' | 'max' | null;

interface FilterSectionProps {
  visible: boolean;
  locationLabel: string;
  onLocationChange: (val: string) => void;
  coordinates?: { latitude: number; longitude: number } | null;
  mapRegion?: any;
  onLocationPress: () => void;
  useWeatherPrefs: boolean;
  rainTolerance: RainValue;
  tempMin: number;
  tempMax: number;
  windLevel: number;
  onConfirmFilters: (filters: {
    locationLabel: string;
    useWeatherPrefs: boolean;
    rainTolerance: RainValue;
    tempMin: number;
    tempMax: number;
    windLevel: number;
  }) => void;
  onClearFilters: () => void;
  tempPicker: TempPickerMode;
  onTempPickerClose: () => void;
  onTempPickerOpen: (mode: 'min' | 'max') => void;
  onTempValueChange: (value: number) => void;
}

export function FilterSection({
  visible,
  locationLabel,
  onLocationChange,
  coordinates,
  mapRegion,
  onLocationPress,
  useWeatherPrefs,
  rainTolerance,
  tempMin,
  tempMax,
  windLevel,
  onConfirmFilters,
  onClearFilters,
  tempPicker,
  onTempPickerClose,
  onTempPickerOpen,
  onTempValueChange,
}: FilterSectionProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  const [tempLocationLabel, setTempLocationLabel] = useState(locationLabel);
  const [tempUseWeatherPrefs, setTempUseWeatherPrefs] = useState(useWeatherPrefs);
  const [tempRainTolerance, setTempRainTolerance] = useState(rainTolerance);
  const [tempTempMin, setTempTempMin] = useState(tempMin);
  const [tempTempMax, setTempTempMax] = useState(tempMax);
  const [tempWindLevel, setTempWindLevel] = useState(windLevel);

  useEffect(() => {
    if (visible) {
      setTempLocationLabel(locationLabel);
      setTempUseWeatherPrefs(useWeatherPrefs);
      setTempRainTolerance(rainTolerance);
      setTempTempMin(tempMin);
      setTempTempMax(tempMax);
      setTempWindLevel(windLevel);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setTempTempMin(tempMin);
      setTempTempMax(tempMax);
    }
  }, [visible, tempMin, tempMax]);

  const handleConfirm = () => {
    onConfirmFilters({
      locationLabel: tempLocationLabel,
      useWeatherPrefs: tempUseWeatherPrefs,
      rainTolerance: tempRainTolerance,
      tempMin: tempTempMin,
      tempMax: tempTempMax,
      windLevel: tempWindLevel,
    });
  };

  const handleClear = () => {
    onClearFilters();
  };

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible, slideAnim, opacityAnim]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
        className="mb-4"
      >
        <View className="bg-white rounded-2xl shadow-soft-1 p-5">
          <LocationInput
            value={tempLocationLabel}
            onChange={setTempLocationLabel}
            coordinates={coordinates}
            mapRegion={mapRegion}
            onPress={onLocationPress}
          />

          <View className="flex-row items-center justify-between mb-2 mt-2">
            <Text
              className="text-[15px] text-typography-800"
              style={{ fontFamily: 'Roboto-Medium' }}
            >
              Weather Preferences
            </Text>
            <Switch
              value={tempUseWeatherPrefs}
              onValueChange={setTempUseWeatherPrefs}
            />
          </View>

          {tempUseWeatherPrefs && (
            <WeatherPreferencesCard
              rainTolerance={tempRainTolerance}
              onRainToleranceChange={setTempRainTolerance}
              tempMin={tempTempMin}
              tempMax={tempTempMax}
              onTempMinPress={() => onTempPickerOpen('min')}
              onTempMaxPress={() => onTempPickerOpen('max')}
              windLevel={tempWindLevel}
              onWindLevelChange={setTempWindLevel}
            />
          )}

          <View className="flex-row gap-3 mt-4">
            <Button
              variant="solid"
              size="md"
              className="flex-1 rounded-lg"
              onPress={handleClear}
            >
              <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                Clear
              </ButtonText>
            </Button>
            <Button
              variant="solid"
              size="md"
              action="primary"
              className="flex-1 rounded-lg bg-tertiary-400"
              onPress={handleConfirm}
            >
              <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                Apply
              </ButtonText>
            </Button>
          </View>
        </View>
      </Animated.View>
    </>
  );
}