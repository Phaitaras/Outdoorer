import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

import { Text } from '@/components/ui/text';
import {
  Button,
  ButtonText,
} from '@/components/ui/button';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import {
  MapPin,
  ChevronDown,
  CalendarDays,
  Clock,
  Search,
  Laugh,
  Smile,
  Meh,
  Frown,
  Angry,
} from 'lucide-react-native';

const ACTIVITIES = [
  { label: 'Running', value: 'Running' },
  { label: 'Cycling', value: 'Cycling' },
  { label: 'Hiking', value: 'Hiking' },
  { label: 'Rock Climbing', value: 'Rock Climbing' },
  { label: 'Kayaking', value: 'Kayaking' },
  { label: 'Sailing', value: 'Sailing' },
  { label: 'Surfing', value: 'Surfing' },
  { label: 'Kitesurfing', value: 'Kitesurfing' },
  { label: 'Windsurfing', value: 'Windsurfing' },
  { label: 'Generic Sport', value: 'Generic Sport' },
];

const SENTIMENT_COLORS = {
  GREAT: '#7FD36E',
  GOOD: '#AFDF55',
  FAIR: '#FFD166',
  BAD: '#FF914D',
  POOR: '#FF5C5C',
} as const;

const RAIN_OPTIONS = [
  { value: 'clear', label: 'Clear', Icon: Laugh, level: 0, sentiment: 'GREAT' },
  { value: 'drizzle', label: 'Drizzle', Icon: Smile, level: 1, sentiment: 'GOOD' },
  { value: 'light', label: 'Light\nRain', Icon: Meh, level: 2, sentiment: 'FAIR' },
  { value: 'moderate', label: 'Moderate\nRain', Icon: Frown, level: 3, sentiment: 'BAD' },
  { value: 'heavy', label: 'Heavy\nRain', Icon: Angry, level: 4, sentiment: 'POOR' },
] as const;

const TEMP_VALUES = Array.from({ length: 41 }, (_, i) => -10 + i); // -10 .. 30

type RainValue = (typeof RAIN_OPTIONS)[number]['value'];
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
  const toleranceIndex = RAIN_OPTIONS.findIndex((o) => o.value === rainTolerance);

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

  const handleDateChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setDate(selected);
  };

  const handleTimeChange = (_: DateTimePickerEvent, selected?: Date) => {
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

        <View className="mb-4">
          <Text
            className="mb-1 text-[14px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Activity <Text className="text-error-500">*</Text>
          </Text>

          <Select selectedValue={activity} onValueChange={setActivity}>
            <SelectTrigger className="rounded-lg border border-outline-200 bg-white">
              <SelectInput
                placeholder="Select activity"
                className="text-[14px]"
              />
              <SelectIcon as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                {ACTIVITIES.map((a) => (
                  <SelectItem key={a.value} label={a.label} value={a.value} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <View className="mb-5">
          <Text
            className="mb-1 text-[14px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Location <Text className="text-error-500">*</Text>
          </Text>

          <Input className="rounded-lg bg-white">
            <InputSlot className="pl-2">
              <InputIcon as={MapPin} />
            </InputSlot>
            <InputField
              value={location}
              onChangeText={setLocation}
              placeholder="Search a location"
              className="text-[14px]"
            />
            <InputSlot className="pr-2">
              <InputIcon as={Search} />
            </InputSlot>
          </Input>

          <Text
            className="mt-1 text-[11px] text-typography-500"
            style={{ fontFamily: 'Roboto-Light' }}
          >
            Defaulting to current location
          </Text>
        </View>

        <View className="mb-4">
          <Text
            className="mb-1 text-[14px] text-typography-700"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            Date <Text className="text-error-500">*</Text>
          </Text>

          <Pressable
            onPress={openDatePicker}
            className="rounded-lg bg-white border border-outline-200 px-3 py-3 flex-row items-center justify-between"
          >
            <Text
              className="text-[14px] text-typography-800"
              style={{ fontFamily: 'Roboto-Regular' }}
            >
              {formatDate(date)}
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
            onPress={() => openTimePicker('start')}
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

                  const sentimentKey =
                    option.sentiment as keyof typeof SENTIMENT_COLORS;
                  const sentimentColor = SENTIMENT_COLORS[sentimentKey];

                  const baseBorder = '#D4D4D8';
                  const baseLabel = '#9CA3AF';

                  const borderColor = isWithinTolerance
                    ? sentimentColor
                    : baseBorder;

                  const backgroundColor = isSelected
                    ? `${sentimentColor}33`
                    : isWithinTolerance
                    ? `${sentimentColor}20`
                    : '#FFFFFF';

                  const iconColor = isWithinTolerance
                    ? sentimentColor
                    : baseBorder;

                  const labelColor = isWithinTolerance
                    ? sentimentColor
                    : baseLabel;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setRainTolerance(option.value)}
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
                    onPress={() => setTempPicker('min')}
                    className="rounded-2xl bg-[#F4F4F5] px-4 py-3 items-center justify-center"
                  >
                    <Text
                      className="text-[14px]"
                      style={{ fontFamily: 'Roboto-Medium' }}
                    >
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
                    onPress={() => setTempPicker('max')}
                    className="rounded-2xl bg-[#F4F4F5] px-4 py-3 items-center justify-center"
                  >
                    <Text
                      className="text-[14px]"
                      style={{ fontFamily: 'Roboto-Medium' }}
                    >
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
                onValueChange={(val) => setWindLevel(Math.round(val))}
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
        )}

        <Button
          variant="solid"
          size="md"
          action="primary"
          className="mt-8 rounded-lg bg-tertiary-400"
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

      {showDatePicker && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.pickerCard}>
            <DateTimePicker
              mode="date"
              value={date}
              onChange={handleDateChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          </View>
        </View>
      )}

      {showTimePicker && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowTimePicker(false)}
          />
          <View style={styles.pickerCard}>
            <DateTimePicker
              mode="time"
              value={timePickerTarget === 'start' ? timeStart : timeEnd}
              onChange={handleTimeChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          </View>
        </View>
      )}

      {tempPicker && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setTempPicker(null)}
          />
          <View style={styles.pickerCard}>
            <Picker
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
            >
              {TEMP_VALUES.map((t) => (
                <Picker.Item key={t} label={`${t}°C`} value={t} />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,15,15,0.2)',
  },
  pickerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 8,
  },
});
