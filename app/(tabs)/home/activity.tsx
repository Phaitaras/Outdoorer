import { PlanTimeModal } from '@/components/home/activity/planTimeModal';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ActivityGraph } from '@/components/home/activity/activityGraph';
import { ActivityHeader } from '@/components/home/activity/activityHeader';
import { FigureModal } from '@/components/home/activity/figureModal';
import { HourlyTable } from '@/components/home/activity/hourlyTable';
import { RecommendedWindow } from '@/components/home/activity/recommendedWindow';
import { LocationHeader } from '@/components/home/locationHeader';
import { Text } from '@/components/ui/text';
import { useActivityDetail } from '@/features/activity';

export default function ActivityDetailScreen() {
  const {
    activity,
    status,
    activityIdParam,
    selectedIndex,
    setSelectedIndex,
    showFigures,
    setShowFigures,
    showPlanModal,
    setShowPlanModal,
    planStart,
    planEnd,
    recommendedStart,
    recommendedEnd,
    recommendedLabel,
    selectedBar,
    hourlyWeatherData,
    activityData,
    locationLabel,
    dateLabel,
    handleCreateActivity,
  } = useActivityDetail();

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[10%]">
      <ScrollView className="flex-1 px-8 mt-6" showsVerticalScrollIndicator={false}>
        <LocationHeader locationLabel={locationLabel} displayArrow={true} className='mb-6'/>
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
          dateLabel={dateLabel}
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
