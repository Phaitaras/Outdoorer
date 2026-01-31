import { PlanTimeModal } from '@/components/home/activity/planTimeModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useActivityById, useCreateActivity } from '@/features/activity';
import { getHourlyWeatherData, useWeather } from '@/features/weather';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { findRecommendedWindow } from '@/utils/activity';


export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ activity?: string; status?: Sentiment; openPlanModal?: string; date?: string; activityId?: string }>();
  const router = useRouter();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment) ?? 'GOOD';
  const { location } = useLocationContext();

  const baseDate = useMemo(() => (params.date ? new Date(params.date) : new Date()), [params.date]);
  const activityIdParam = params.activityId ? Number(params.activityId) : null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFigures, setShowFigures] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planStart, setPlanStart] = useState<Date>(baseDate);
  const [planEnd, setPlanEnd] = useState<Date>(baseDate);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const activityType = ACTIVITY_TO_LABEL[activity] ?? 'generic_sports';

  // fetch activityId if provided and check review
  const { data: activityData } = useActivityById(activityIdParam);

  const { data: weatherData } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  const { recommendedStart, recommendedEnd } = useMemo(() => {
    const window = findRecommendedWindow();
    return { recommendedStart: window.start, recommendedEnd: window.end };
  }, []);

  const selectedBar = useMemo(() => GRAPH_DATA[selectedIndex] ?? GRAPH_DATA[0], [selectedIndex]);

  const hourlyWeatherData = useMemo(() => 
    getHourlyWeatherData(selectedBar.hour, weatherData ?? null),
    [selectedBar.hour, weatherData]
  );

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
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create an activity.');
      return;
    }

    try {
      await createActivityMutation.mutateAsync({
        userId,
        activityType,
        locationId: null,
        startTime: start,
        endTime: end,
      });
      
      Alert.alert('Success', 'Your activity has been planned.');
      setShowPlanModal(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save your activity. Please try again.');
    }
  };

  const createActivityMutation = useCreateActivity();


  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[10%]">
      <ScrollView className="flex-1 px-8 mt-6" showsVerticalScrollIndicator={false}>
        <LocationHeader locationLabel="Glasgow, United Kingdom" displayArrow={true} className='mb-6'/>
        <ActivityHeader 
          activity={activity} 
          status={status} 
          onPlan={() => setShowPlanModal(true)}
          hasReview={activityData?.hasReview ?? false}
          reviewId={activityData?.reviewId ?? null}
          activityId={activityIdParam?.toString()}
          activityEndTime={activityData?.end_time ?? null}
        />

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
