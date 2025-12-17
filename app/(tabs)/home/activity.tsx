import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ActivityGraph } from '@/components/home/activity/activityGraph';
import { ActivityHeader } from '@/components/home/activity/activityHeader';
import { GRAPH_DATA } from '@/components/home/activity/constants';
import { FigureModal } from '@/components/home/activity/figureModal';
import { HourlyTable } from '@/components/home/activity/hourlyTable';
import { RecommendedWindow } from '@/components/home/activity/recommendedWindow';
import { LocationHeader } from '@/components/home/locationHeader';
import { Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';


export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ activity?: string; status?: Sentiment }>();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment) ?? 'GOOD';

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFigures, setShowFigures] = useState(false);

  const selectedBar = useMemo(
    () => GRAPH_DATA[selectedIndex],
    [selectedIndex],
  );

  const recommendedIndices = GRAPH_DATA
    .map((b, i) =>
      (b.sentiment === 'GREAT' || b.sentiment === 'GOOD') ? i : null,
    )
    .filter((i) => i !== null) as number[];

  const recommendedStart = recommendedIndices[0] ?? 0;
  const recommendedEnd = recommendedIndices[recommendedIndices.length - 1] ?? 0;
  const recommendedCount = recommendedEnd - recommendedStart + 1;


  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[10%]">
      <ScrollView className="flex-1 px-8 mt-6" showsVerticalScrollIndicator={false}>
        <LocationHeader locationLabel="Glasgow, United Kingdom" displayArrow={true} className='mb-6'/>
        <ActivityHeader activity={activity} status={status} />

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

        <RecommendedWindow dateLabel="Thursday, October 16" windowLabel="10:00 - 15:00" />

        <HourlyTable selectedHour={selectedBar.hour} rows={[
          ['Temperature', '10° C', 'Wind Speed', '9.4 km/h'],
          ['Weather Code', 'Drizzle', 'Wind Direction', '312°'],
          ['Precipitation', '0.2 mm', 'Wind Gust', '22.7 km/h'],
        ]} />
      </ScrollView>

      <FigureModal visible={showFigures} onClose={() => setShowFigures(false)} />
    </View>
  );
}
