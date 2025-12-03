import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  ArrowRight as LucideArrowRight,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';

import { Sentiment, SentimentIcon } from '@/components/home/sentiment';
import { StatusBadge } from '@/components/home/statusBadge';

// ---- graph config ----------------------------------------------------------

const ROWS: Sentiment[] = ['GREAT', 'GOOD', 'FAIR', 'BAD', 'POOR'];

type HourBar = { hour: string; sentiment: Sentiment };

const GRAPH_DATA: HourBar[] = [
  { hour: '9:00', sentiment: 'GOOD' },
  { hour: '10:00', sentiment: 'GREAT' },
  { hour: '11:00', sentiment: 'GREAT' },
  { hour: '12:00', sentiment: 'GREAT' },
  { hour: '13:00', sentiment: 'GREAT' },
  { hour: '14:00', sentiment: 'GREAT' },
  { hour: '15:00', sentiment: 'GOOD' },
  { hour: '16:00', sentiment: 'FAIR' },
  { hour: '17:00', sentiment: 'FAIR' },
  { hour: '18:00', sentiment: 'FAIR' },
  { hour: '19:00', sentiment: 'BAD' },
  { hour: '20:00', sentiment: 'BAD' },
  { hour: '21:00', sentiment: 'POOR' },
  { hour: '22:00', sentiment: 'POOR' },
  { hour: '23:00', sentiment: 'POOR' },
  { hour: '00:00', sentiment: 'POOR' },
];

const SENTIMENT_COLOR: Record<Sentiment, string> = {
  GREAT: '#7FD36E',
  GOOD: '#AFDF55',
  FAIR: '#FFD166',
  BAD: '#FF914D',
  POOR: '#FF5C5C',
};

const BAR_HEIGHT_CLASS: Record<Sentiment, string> = {
  POOR: 'h-[2.4rem]',
  BAD: 'h-[4.8rem]',
  FAIR: 'h-[7.2rem]',
  GOOD: 'h-[9.6rem]',
  GREAT: 'h-[12rem]',
};

const BAR_FILL_COLOR: Record<Sentiment, string> = {
  GREAT: '#CFE8C4',
  GOOD: '#DDECBD',
  FAIR: '#F4E9C3',
  BAD: '#F8D1BC',
  POOR: '#F8BCBC',
};


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

  // recommended = contiguous block of "GOOD or better"
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
        {/* location */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <MapPin size={18} />
            <Text className="text-[20px]" style={{fontFamily: 'Roboto-Medium'}}>
              Glasgow, United Kingdom
            </Text>
          </View>
          <Button variant="solid" size="xs" className="px-2 rounded-md">
            <ButtonIcon as={SlidersHorizontal} />
          </Button>
        </View>

        {/* activity header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg" style={{fontFamily: 'Roboto-Medium'}}>🏃‍♂️  {activity}</Text>
            <StatusBadge value={status} />
          </View>
          <Button size="sm" variant="solid" className="rounded-full">
            <ButtonText className="text-white" style={{fontFamily: 'Roboto-Regular'}}>Plan Activity</ButtonText>
          </Button>
        </View>

        <Text className="text-xs text-typography-600 mb-1 text-center" style={{fontFamily: 'Roboto-Regular'}}>
          Recommended
        </Text>

        {/* graph wrapper */}
        <View className="flex-row mt-1 mb-3 mx-1">
          {/* y axis */}
          <View className="mr-2 justify-between pt-[1.9rem]">
            {ROWS.map((s) => (
              <View
                key={s}
                className="h-[2.4rem] justify-center"
              >
                <Text className="text-[11px] text-center text-typography-600" style={{fontFamily: 'Roboto-Regular'}}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* graph */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            <View>
              {/* hours */}
              <View className="flex-row mb-2">
                {GRAPH_DATA.map((bar, index) => {
                  const isActive = index === selectedIndex;
                  const isRecommended =
                    index >= recommendedStart && index <= recommendedEnd;

                  return (
                    <Pressable
                      key={bar.hour}
                      onPress={() => setSelectedIndex(index)}
                      className={`mx-1 w-[2.4rem] rounded-lg py-1 ${isActive
                        ? 'bg-[#FFAE00]'
                        : isRecommended
                          ? 'bg-gray-200'
                          : ''
                        }`}
                    >
                      <Text
                        className={`text-2xs text-center ${isActive ? 'text-white' : 'text-typography-800'
                          }`}
                        style={{fontFamily: 'Roboto-Regular'}}
                      >
                        {bar.hour}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* bars */}
              <View className="relative">
                {/* grid behind bars */}
                <View
                  pointerEvents="none"
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 0 }}
                >
                  {ROWS.map((_, idx) => (
                    <View
                      key={idx}
                      className="h-[2.4rem] border-b border-outline-200"
                    />
                  ))}
                </View>

                {/* each bar */}
                <View className="flex-row items-end" style={{ zIndex: 1 }}>
                  {GRAPH_DATA.map((bar, index) => {
                    const sentiment = bar.sentiment;
                    const color = SENTIMENT_COLOR[sentiment];
                    const isActive = index === selectedIndex;

                    return (
                      <Pressable
                        key={bar.hour}
                        onPress={() => setSelectedIndex(index)}
                        className="items-center mx-1"
                      >
                        <View
                          className={`w-[2.4rem] rounded-lg justify-start items-center pt-2 ${BAR_HEIGHT_CLASS[sentiment]}`}
                          style={{
                            backgroundColor: BAR_FILL_COLOR[sentiment],
                            borderColor: isActive ? '#FFAE00' : color,
                            borderWidth: isActive ? 2 : 1,
                          }}
                        >
                          <SentimentIcon value={sentiment} />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

            </View>
          </ScrollView>
        </View>

        {/* whats this */}
        <Pressable
          onPress={() => setShowFigures(true)}
          className="self-end mb-4"
        >
          <Text className="text-[11px] text-typography-500 underline" style={{fontFamily: 'Roboto-Regular'}}>
            What is this?
          </Text>
        </Pressable>

        {/* recommended window text */}
        <Text className="text-sm mb-2" style={{fontFamily: 'Roboto-Medium'}}>
          Thursday, October 16
        </Text>

        <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-3 flex-row items-center justify-between">
          <Text className="text-sm text-typography-700" style={{fontFamily: 'Roboto-Medium'}}>Recommended Window</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm" style={{fontFamily: 'Roboto-Medium'}}>10:00 - 15:00</Text>
            <LucideArrowRight size={16} />
          </View>
        </View>

        {/* hourly table */}
        <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm" style={{fontFamily: 'Roboto-Medium'}}>Hourly Window</Text>
            <Text className="text-sm text-typography-600" style={{fontFamily: 'Roboto-Regular'}}>
              {selectedBar.hour}
            </Text>
          </View>

          {[
            ['Temperature', '10° C', 'Wind Speed', '9.4 km/h'],
            ['Weather Code', 'Drizzle', 'Wind Direction', '312°'],
            ['Precipitation', '0.2 mm', 'Wind Gust', '22.7 km/h'],
          ].map(([k1, v1, k2, v2]) => (
            <View
              key={k1}
              className="flex-row justify-between py-2 border-b border-outline-100 last:border-b-0"
            >
              <View className="w-1/2 pr-2">
                <Text className="text-[11px] text-typography-500" style={{fontFamily: 'Roboto-Regular'}}>{k1}</Text>
                <Text className="text-[13px] text-typography-800" style={{fontFamily: 'Roboto-Regular'}}>{v1}</Text>
              </View>
              <View className="w-1/2 pl-2 items-end">
                <Text className="text-[11px] text-typography-500" style={{fontFamily: 'Roboto-Regular'}}>{k2}</Text>
                <Text className="text-[13px] text-typography-800" style={{fontFamily: 'Roboto-Regular'}}>{v2}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* graph figures modal (unchanged from before, except sentiment set) */}
      {showFigures && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center px-6">
          <View className="bg-[#F6F6F7] rounded-2xl w-full px-4 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-md" style={{fontFamily: 'Roboto-Medium'}}>Graph Figures</Text>
              <Pressable onPress={() => setShowFigures(false)}>
                <X size={20} />
              </Pressable>
            </View>

            <View className="flex-row justify-center gap-4">
              <View className="flex flex-col items-center gap-1">
                <View className="px-2 py-1 rounded-lg bg-[#FFAE00]">
                  <Text className="text-xs text-white" style={{fontFamily: 'Roboto-Medium'}}>
                    9:00
                  </Text>
                </View>
                <Text className="text-xs text-typography-700" style={{fontFamily: 'Roboto-Regular'}}>Selected</Text>
              </View>
              <View className="flex flex-col items-center gap-1">
                <View className="px-2 py-1 rounded-lg bg-[#ffd987]">
                  <Text className="text-xs text-typography-700" style={{fontFamily: 'Roboto-Regular'}}>10:00</Text>
                </View>
                <Text className="text-xs text-typography-700" style={{fontFamily: 'Roboto-Regular'}}>Your Window</Text>
              </View>
              <View className="flex flex-col items-center gap-1">
                <View className="px-2 py-1 rounded-lg bg-gray-200">
                  <Text className="text-xs text-typography-700" style={{fontFamily: 'Roboto-Regular'}}>11:00</Text>
                </View>
                <Text className="text-xs text-typography-700" style={{fontFamily: 'Roboto-Regular'}}>Recommended</Text>
              </View>
            </View>

            {/* MINI GRAPH – matches main grid look */}
            <View className="flex-row items-end justify-center mt-4 mb-2">
              {(['POOR', 'BAD', 'FAIR', 'GOOD', 'GREAT'] as Sentiment[]).map((s, idx) => {
                const barHeight = {
                  POOR: '2.4rem',
                  BAD: '4.8rem',
                  FAIR: '7.2rem',
                  GOOD: '9.6rem',
                  GREAT: '12rem',
                }[s];

                return (
                  <View key={s} className="items-center mx-1">
                    <View
                      className="w-[2.4rem] rounded-lg justify-start items-center pt-2"
                      style={{
                        height: barHeight,
                        backgroundColor: BAR_FILL_COLOR[s],
                        borderColor: SENTIMENT_COLOR[s],
                        borderWidth: 1,
                      }}
                    >
                      <SentimentIcon value={s} />
                    </View>

                    <Text
                      className="mt-1 text-[10px] text-typography-700"
                      style={{fontFamily: 'Roboto-Medium'}}
                    >
                      {s}
                    </Text>
                  </View>
                );
              })}
            </View>

          </View>
        </View>
      )}
    </View>
  );
}
