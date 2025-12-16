import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { ActivitySelect } from '@/components/plan/activitySelect';
import { type RainValue } from '@/components/plan/constants';
import { DatePickerModal } from '@/components/plan/datePickerModal';
import { DateTimePickers } from '@/components/plan/dateTimePickers';
import { LocationInput } from '@/components/plan/locationInput';
import { TemperaturePickerModal } from '@/components/plan/temperaturePickerModal';
import { TimePickerModal } from '@/components/plan/timePickerModal';
import { WeatherPreferencesCard } from '@/components/plan/weatherPreferencesCard';
import {
  Button,
  ButtonText,
} from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

type TempPickerMode = 'min' | 'max' | null;

export default function Plan() {
  const [activity, setActivity] = useState<string>('Running');
  const [location, setLocation] = useState('Kelvinhaugh, Glasgow');

  const [date, setDate] = useState<Date>(new Date());
  const [timeStart, setTimeStart] = useState<Date>(new Date());
  const [timeEnd, setTimeEnd] = useState<Date>(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end'>(
    'start',
  );

  const [useWeatherPrefs, setUseWeatherPrefs] = useState(true);

  const [rainTolerance, setRainTolerance] = useState<RainValue>('light');

  const [tempMin, setTempMin] = useState<number>(8);
  const [tempMax, setTempMax] = useState<number>(28);
  const [tempPicker, setTempPicker] = useState<TempPickerMode>(null);

  const [windLevel, setWindLevel] = useState<number>(1); // 0 - 2

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const timeRangeLabel = `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;

  const handleDateChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setDate(selected);
  };

  const handleTimeChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selected) {
      if (timePickerTarget === 'start') {
        setTimeStart(selected);
        if (selected >= timeEnd) {
          setTimeEnd(new Date(selected.getTime() + 60 * 60 * 1000));
        }
      } else {
        setTimeEnd(selected);
      }
    }
  };

  const openDatePicker = () => setShowDatePicker(true);

  const openTimePicker = (target: 'start' | 'end') => {
    setTimePickerTarget(target);
    setShowTimePicker(true);
  };


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

        <LocationInput value={location} onChange={setLocation} />

        <DateTimePickers
          date={formatDate(date)}
          timeRangeLabel={timeRangeLabel}
          onDatePress={openDatePicker}
          onTimePress={() => openTimePicker('start')}
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
            console.log({
              activity,
              location,
              date,
              timeStart,
              timeEnd,
              useWeatherPrefs,
              rainTolerance,
              tempMin,
              tempMax,
              windLevel,
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

      <TimePickerModal
        visible={showTimePicker}
        value={timePickerTarget === 'start' ? timeStart : timeEnd}
        onChange={handleTimeChange}
        onClose={() => setShowTimePicker(false)}
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
