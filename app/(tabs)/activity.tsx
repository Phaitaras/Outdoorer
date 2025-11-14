import React, { useMemo, useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { MapPin, SlidersHorizontal, X } from 'lucide-react-native';
import { Sentiment, SentimentIcon } from '@/components/home/sentiment';
import { StatusBadge } from '@/components/home/statusBadge';
import { ArrowRight } from 'lucide-react-native';

// dummy graph data
const HOURS = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] as const;
const ROWS: Sentiment[] = ['IDEAL', 'GREAT', 'GOOD', 'FAIR', 'BAD'];

type HourBar = {
  hour: string;
  sentiment: Sentiment;
};

const GRAPH_DATA: HourBar[] = [
  { hour: '9:00', sentiment: 'GREAT' },
  { hour: '10:00', sentiment: 'IDEAL' },
  { hour: '11:00', sentiment: 'IDEAL' },
  { hour: '12:00', sentiment: 'IDEAL' },
  { hour: '13:00', sentiment: 'IDEAL' },
  { hour: '14:00', sentiment: 'IDEAL' },
  { hour: '15:00', sentiment: 'GREAT' },
];

const SENTIMENT_COLOR: Record<Sentiment, string> = {
  IDEAL: '#7FD36E',
  GREAT: '#AFDF55',
  GOOD: '#FFD166',
  FAIR: '#FF914D',
  BAD: '#FF5C5C',
};

export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ activity?: string; status?: Sentiment }>();
  const activity = params.activity ?? 'Running';
  const status = (params.status as Sentiment) ?? 'GREAT';

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFigures, setShowFigures] = useState(false);

  const selectedBar = useMemo(
    () => GRAPH_DATA[selectedIndex],
    [selectedIndex]
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <ScrollView
        className="flex-1 px-8 mt-6 flex-col"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <MapPin size={18} />
            <Text className="font-roboto-medium text-[20px]">Glasgow, United Kingdom</Text>
          </View>
          <Button variant="solid" size="xs" className="px-2 rounded-md">
            <ButtonIcon as={SlidersHorizontal} />
          </Button>
        </View>

        {/* header: activity + badge + action button */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-roboto-medium">🏃‍♂️  {activity}</Text>
            <StatusBadge value={status} />
          </View>
          <Button size="sm" variant="solid" className="rounded-full">
            <ButtonText className="text-white">Plan Activity</ButtonText>
          </Button>
        </View>

        {/* graph section */}
        <Text className="text-xs text-typography-600 mb-1">Recommended</Text>

        {/* hour tabs row (can scroll horizontally if needed) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {GRAPH_DATA.map((bar, index) => {
            const isActive = index === selectedIndex;
            return (
              <Pressable
                key={bar.hour}
                onPress={() => setSelectedIndex(index)}
                className={`px-3 py-1 rounded-full mr-2 border ${isActive ? 'bg-[#FFAE00] border-[#FFAE00]' : 'border-outline-200'
                  }`}
              >
                <Text
                  className={`text-xs font-roboto-medium ${isActive ? 'text-white' : 'text-typography-800'
                    }`}
                >
                  {bar.hour}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* bar chart */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-1 mb-3"
        >
          <View className="flex-row">
            {/* y-axis labels */}
            <View className="justify-between mr-2 py-2">
              {ROWS.map((s) => (
                <Text
                  key={s}
                  className="text-[11px] text-typography-600 mb-2"
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </Text>
              ))}
            </View>

            {/* bars */}
            <View className="flex-row items-end gap-2 py-2">
              {GRAPH_DATA.map((bar, index) => {
                const sentiment = bar.sentiment;
                const color = SENTIMENT_COLOR[sentiment];

                // map sentiment -> bar height
                const heightBySentiment: Record<Sentiment, number> = {
                  BAD: 60,
                  FAIR: 90,
                  GOOD: 120,
                  GREAT: 150,
                  IDEAL: 180,
                };

                const isActive = index === selectedIndex;

                return (
                  <Pressable
                    key={bar.hour}
                    onPress={() => setSelectedIndex(index)}
                    className="items-center"
                  >
                    <View
                      style={{
                        height: heightBySentiment[sentiment],
                        width: 40,
                        backgroundColor: color + '70', // translucent fill
                        borderRadius: 6,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive ? '#FFAE00' : color,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingTop: 6,
                      }}
                    >
                      <SentimentIcon value={sentiment} />
                    </View>
                    <Text className="text-[11px] mt-1 text-typography-600">
                      {bar.hour}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => setShowFigures(true)}
          className="self-end mb-4"
        >
          <Text className="text-[11px] text-typography-500 underline">
            What is this?
          </Text>
        </Pressable>

        {/* date + recommended window summary (simple mock) */}
        <Text className="text-sm font-roboto-medium mb-2">
          Thursday, October 16
        </Text>

        <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-3 flex-row items-center justify-between">
          <Text className="text-sm text-typography-700">Recommended Window</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-roboto-medium">10:00 - 15:00</Text>
            <ArrowRight size={16} className="text-typography-700" />
          </View>
        </View>

        {/* Hourly window table mock */}
        <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-roboto-medium text-sm">Hourly Window</Text>
            <Text className="text-sm text-typography-600">{selectedBar.hour}</Text>
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
                <Text className="text-[11px] text-typography-500">{k1}</Text>
                <Text className="text-[13px] text-typography-800">{v1}</Text>
              </View>
              <View className="w-1/2 pl-2 items-end">
                <Text className="text-[11px] text-typography-500">{k2}</Text>
                <Text className="text-[13px] text-typography-800">{v2}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Graph Figures modal */}
      {showFigures && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center px-6">
          <View className="bg-white rounded-2xl w-full px-4 py-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-roboto-medium text-md">Graph Figures</Text>
              <Pressable onPress={() => setShowFigures(false)}>
                <X size={20} />
              </Pressable>
            </View>

            {/* top tabs */}
            <View className="flex-row mb-3">
              <View className="px-3 py-1 rounded-full bg-[#FFAE00] mr-2">
                <Text className="text-xs text-white font-roboto-medium">
                  Selected {selectedBar.hour}
                </Text>
              </View>
              <View className="px-3 py-1 rounded-full bg-outline-100 mr-2">
                <Text className="text-xs text-typography-700">Your Window</Text>
              </View>
              <View className="px-3 py-1 rounded-full bg-outline-100">
                <Text className="text-xs text-typography-700">Recommended</Text>
              </View>
            </View>

            {/* mini bar chart summary */}
            <View className="flex-row justify-between items-end mt-2 mb-3">
              {(['BAD', 'FAIR', 'GOOD', 'GREAT', 'IDEAL'] as Sentiment[]).map(
                (s, idx) => (
                  <View key={s} className="items-center mx-1">
                    <View
                      style={{
                        height: 40 + idx * 18,
                        width: 32,
                        backgroundColor: SENTIMENT_COLOR[s] + '55',
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <SentimentIcon value={s} />
                    </View>
                    <Text className="text-[10px] mt-1">{s}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
