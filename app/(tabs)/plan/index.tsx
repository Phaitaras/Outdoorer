import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { ActivitySelect } from '@/components/plan/activitySelect';
import { type RainValue } from '@/components/plan/constants';
import { DateInput } from '@/components/plan/dateInput';
import { DatePickerModal } from '@/components/plan/datePickerModal';
import { LocationInput } from '@/components/plan/locationInput';
import { TemperaturePickerModal } from '@/components/plan/temperaturePickerModal';
import { WeatherPreferencesCard } from '@/components/plan/weatherPreferencesCard';
import {
  Button,
  ButtonText,
} from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { usePlannerLocation } from '@/features/plan/hooks/usePlannerLocation';
import { useLocationContext } from '@/providers/location';

type TempPickerMode = 'min' | 'max' | null;

export default function Plan() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    selectedLat?: string; 
    selectedLng?: string; 
    selectedAddress?: string;
  }>();
  
  const [activity, setActivity] = useState<string>('Running');
  const { location: currentLocation } = useLocationContext();

  const [date, setDate] = useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [useWeatherPrefs, setUseWeatherPrefs] = useState(true);

  const [rainTolerance, setRainTolerance] = useState<RainValue>('light');

  const [tempMin, setTempMin] = useState<number>(8);
  const [tempMax, setTempMax] = useState<number>(28);
  const [tempPicker, setTempPicker] = useState<TempPickerMode>(null);

  const [windLevel, setWindLevel] = useState<number>(1); // 0 - 2

  const {
    coordinates,
    mapRegion,
    locationLabel,
    setLocationLabel,
  } = usePlannerLocation(params, currentLocation ?? null);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const handleDateChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setDate(selected);
  };

  const openDatePicker = () => setShowDatePicker(true);



  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-[22px] mb-6 text-typography-900"
          style={{ fontFamily: 'Roboto-Bold' }}
        >
          Planner
        </Text>

        <ActivitySelect value={activity} onChange={setActivity} />

        <LocationInput
          value={locationLabel}
          onChange={(val) => {
            setLocationLabel(val);
          }}
          coordinates={coordinates}
          mapRegion={mapRegion}
          onPress={() => {
            router.push({
              pathname: '/(tabs)/plan/location',
              params: coordinates 
                ? { initialLat: coordinates.latitude.toString(), initialLng: coordinates.longitude.toString() }
                : undefined,
            });
          }}
        />

        <DateInput
          value={formatDate(date)}
          onPress={openDatePicker}
        />

        <View className="flex-row items-center justify-between mb-2 mt-2">
          <Text
            className="text-[15px] text-typography-800"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Weather Preferences
          </Text>
          <Switch
            value={useWeatherPrefs}
            onValueChange={setUseWeatherPrefs}
          />
        </View>

        {useWeatherPrefs && (
          <WeatherPreferencesCard
            rainTolerance={rainTolerance}
            onRainToleranceChange={setRainTolerance}
            tempMin={tempMin}
            tempMax={tempMax}
            onTempMinPress={() => setTempPicker('min')}
            onTempMaxPress={() => setTempPicker('max')}
            windLevel={windLevel}
            onWindLevelChange={setWindLevel}
          />
        )}

        <Button
          variant="solid"
          size="md"
          action="primary"
          className="mt-4 mb-4 rounded-lg bg-tertiary-400"
          onPress={() => {
            const dateIso = date.toISOString();
            router.push({
              pathname: '/(tabs)/activity',
              params: { activity, openPlanModal: 'true', date: dateIso },
            });
          }}
        >
          <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
            Start Planning
          </ButtonText>
        </Button>
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        value={date}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
      />

      <TemperaturePickerModal
        visible={tempPicker !== null}
        selectedValue={tempPicker === 'min' ? tempMin : tempMax}
        onValueChange={(val: number) => {
          if (tempPicker === 'min') {
            const next = Math.min(val, tempMax - 1);
            setTempMin(next);
          } else {
            const next = Math.max(val, tempMin + 1);
            setTempMax(next);
          }
        }}
        onClose={() => setTempPicker(null)}
      />
    </View>
  );
}