import { PlanTimeModal } from '@/components/home/activity/planTimeModal';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { ActivityGraph } from '@/components/home/activity/activityGraph';
import { ActivityHeader } from '@/components/home/activity/activityHeader';
import { GRAPH_DATA } from '@/components/home/activity/constants';
import { FigureModal } from '@/components/home/activity/figureModal';
import { HourlyTable } from '@/components/home/activity/hourlyTable';
import { RecommendedWindow } from '@/components/home/activity/recommendedWindow';
import { LocationHeader } from '@/components/home/locationHeader';
import { Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import { ACTIVITY_TO_LABEL } from '@/constants/activities';
import { WEATHER_CODE_TO_DESCRIPTION } from '@/constants/weather';
import { useWeather } from '@/features/weather';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { findRecommendedWindow } from '@/utils/activity';


export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ activity?: string; status?: Sentiment; openPlanModal?: string; date?: string }>();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment) ?? 'GOOD';
  const { location } = useLocationContext();
  const queryClient = useQueryClient();

  const baseDate = useMemo(() => (params.date ? new Date(params.date) : new Date()), [params.date]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFigures, setShowFigures] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planStart, setPlanStart] = useState<Date>(baseDate);
  const [planEnd, setPlanEnd] = useState<Date>(baseDate);

  const { data: weatherData } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  const { recommendedStart, recommendedEnd } = useMemo(() => {
    const window = findRecommendedWindow();
    return { recommendedStart: window.start, recommendedEnd: window.end };
  }, []);

  const selectedBar = useMemo(() => GRAPH_DATA[selectedIndex] ?? GRAPH_DATA[0], [selectedIndex]);

  const hourlyWeatherData = useMemo(() => {
    if (!weatherData?.hours || weatherData.hours.length === 0) return [];

    const selectedHour = selectedBar.hour;
    const hourIndex = weatherData.hours.findIndex((h) => {
      const hDate = new Date(h.time);
      const hHour = hDate.getHours().toString().padStart(2, '0') + ':' + hDate.getMinutes().toString().padStart(2, '0');
      return hHour === selectedHour;
    });

    if (hourIndex === -1) return [];

    const hour = weatherData.hours[hourIndex];
    const tempUnit = weatherData.units === 'imperial' ? '°F' : '°C';
    const speedUnit = weatherData.units === 'imperial' ? 'mph' : 'km/h';
    const weatherDescription = WEATHER_CODE_TO_DESCRIPTION[hour.weathercode] || 'Unknown';

    return [
      ['Temperature', `${Math.round(hour.temperature_2m)}${tempUnit}`, 'Wind Speed', `${Math.round(hour.wind_speed_10m)} ${speedUnit}`],
      ['Weather', weatherDescription, 'Wind Direction', `${Math.round(hour.wind_direction_10m)}°`],
      ['Precipitation', `${hour.precipitation} mm`, 'Wind Gust', `${Math.round(hour.wind_gusts_10m)} ${speedUnit}`],
    ] as [string, string, string, string][];
  }, [selectedBar.hour, weatherData?.hours, weatherData?.units]);

  useEffect(() => {
    if (params.openPlanModal === 'true') {
      setShowPlanModal(true);
    }
  }, [params.openPlanModal]);

  const recommendedLabel = `${GRAPH_DATA[recommendedStart].hour} - ${GRAPH_DATA[recommendedEnd].hour}`;

  useEffect(() => {
    const [rsHour, rsMinute] = GRAPH_DATA[recommendedStart].hour.split(':').map(Number);
    const [reHour, reMinute] = GRAPH_DATA[recommendedEnd].hour.split(':').map(Number);
    const start = new Date(baseDate);
    start.setHours(rsHour, rsMinute, 0, 0);
    const end = new Date(baseDate);
    end.setHours(reHour, reMinute, 0, 0);
    setPlanStart(start);
    setPlanEnd(end);
  }, [baseDate, recommendedStart, recommendedEnd]);

  const handleCreateActivity = async (start: Date, end: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create an activity.');
        return;
      }

      const activityType = ACTIVITY_TO_LABEL[activity] ?? 'generic_sports';

      const { error } = await supabase.from('activity').insert({
        user_id: user.id,
        activity_type: activityType,
        location_id: null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

      if (error) throw error;
      Alert.alert('Success', 'Your activity has been planned.');
      setShowPlanModal(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save your activity. Please try again.');
    }
  };


  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[10%]">
      <ScrollView className="flex-1 px-8 mt-6" showsVerticalScrollIndicator={false}>
        <LocationHeader locationLabel="Glasgow, United Kingdom" displayArrow={true} className='mb-6'/>
        <ActivityHeader activity={activity} status={status} onPlan={() => setShowPlanModal(true)} />

        <Text className="text-xs text-typography-600 mb-1 text-center" style={{fontFamily: 'Roboto-Regular'}}>
          Recommended
        </Text>
        <ActivityGraph selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} recommendedStart={recommendedStart} recommendedEnd={recommendedEnd} />

        <Pressable
          onPress={() => setShowFigures(true)}
          className="self-end mb-4"
        >
          <Text className="text-[11px] text-typography-500 underline" style={{fontFamily: 'Roboto-Regular'}}>
            What is this?
          </Text>
        </Pressable>

        <RecommendedWindow
          dateLabel={baseDate.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}
          windowLabel={recommendedLabel}
        />

        <HourlyTable selectedHour={selectedBar.hour} rows={hourlyWeatherData} />
      </ScrollView>

      <FigureModal visible={showFigures} onClose={() => setShowFigures(false)} />
      <PlanTimeModal
        visible={showPlanModal}
        recommendedLabel={recommendedLabel}
        initialStart={planStart}
        initialEnd={planEnd}
        onConfirm={handleCreateActivity}
        onClose={() => setShowPlanModal(false)}
      />
    </View>
  );
}
