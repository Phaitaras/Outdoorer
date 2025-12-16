import { SentimentIcon, type Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BAR_FILL_COLOR, BAR_HEIGHT_CLASS, GRAPH_DATA, ROWS, SENTIMENT_COLORS } from './constants';

export function ActivityGraph({ selectedIndex, setSelectedIndex, recommendedStart, recommendedEnd }: {
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  recommendedStart: number;
  recommendedEnd: number;
}) {
  return (
    <View className="flex-row mt-1 mb-3 mx-1">
      {/* y axis */}
      <View className="mr-2 justify-between pt-[1.9rem]">
        {ROWS.map((s) => (
          <View key={s} className="h-[2.4rem] justify-center">
            <Text className="text-[11px] text-center text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* graph */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
        <View>
          {/* hours */}
          <View className="flex-row mb-2">
            {GRAPH_DATA.map((bar, index) => {
              const isActive = index === selectedIndex;
              const isRecommended = index >= recommendedStart && index <= recommendedEnd;

              return (
                <Pressable
                  key={bar.hour}
                  onPress={() => setSelectedIndex(index)}
                  className={`mx-1 w-[2.4rem] rounded-lg py-1 ${isActive ? 'bg-[#FFAE00]' : isRecommended ? 'bg-gray-200' : ''}`}
                >
                  <Text className={`text-2xs text-center ${isActive ? 'text-white' : 'text-typography-800'}`} style={{ fontFamily: 'Roboto-Regular' }}>
                    {bar.hour}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* bars */}
          <View className="relative">
            {/* grid behind bars */}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 0 }}>
              {ROWS.map((_, idx) => (
                <View key={idx} className="h-[2.4rem] border-b border-outline-200" />
              ))}
            </View>

            {/* each bar */}
            <View className="flex-row items-end" style={{ zIndex: 1 }}>
              {GRAPH_DATA.map((bar, index) => {
                const sentiment: Sentiment = bar.sentiment;
                const color = SENTIMENT_COLORS[sentiment];
                const isActive = index === selectedIndex;

                return (
                  <Pressable key={bar.hour} onPress={() => setSelectedIndex(index)} className="items-center mx-1">
                    <View
                      className={`w-[2.4rem] rounded-lg justify-start items-center pt-2 ${BAR_HEIGHT_CLASS[sentiment]}`}
                      style={{ backgroundColor: BAR_FILL_COLOR[sentiment], borderColor: isActive ? '#FFAE00' : color, borderWidth: isActive ? 2 : 1 }}
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
  );
}
