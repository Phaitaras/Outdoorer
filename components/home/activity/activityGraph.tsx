import { SentimentIcon, type Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import type { HourBar } from '@/utils/activity';
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BAR_FILL_COLOR, ROWS, SENTIMENT_COLORS } from './constants';

export function ActivityGraph({ 
  data,
  selectedIndex, 
  setSelectedIndex, 
  recommendedStart, 
  recommendedEnd 
}: {
  data: HourBar[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  recommendedStart: number;
  recommendedEnd: number;
}) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const itemWidth = 2.4 * 16 + 8; // w-[2.4rem] + mx-1 (4px each side) in pixels
    const scrollOffset = currentHour * itemWidth - 73; // center it with some padding
    
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: Math.max(0, scrollOffset), animated: false });
    }, 0);
  }, []);

  if (data.length === 0) {
    return <Text className="text-center text-typography-500">No data available</Text>;
  }

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
      <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
        <View>
          {/* hours */}
          <View className="flex-row mb-2">
            {data.map((bar, index) => {
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
            <View className="flex-row items-end h-[12rem]" style={{ zIndex: 1 }}>
              {data.map((bar, index) => {
                const sentiment: Sentiment = bar.sentiment;
                const color = SENTIMENT_COLORS[sentiment];
                const isActive = index === selectedIndex;
                
                // Map score to visual zone height percentages
                // Grid has 5 zones, each 20%: POOR(0-20%), BAD(20-40%), FAIR(40-60%), GOOD(60-80%), GREAT(80-100%)
                let heightPercent: number;
                const score = bar.score;
                
                if (score < 45) {
                  // POOR: map 0-44 to 0-20%, but cap minimum at 20% for visibility
                  heightPercent = Math.max(20, (score / 44) * 20);
                } else if (score < 60) {
                  // BAD: map 45-59 to 20-40%
                  heightPercent = 20 + ((score - 45) / 15) * 20;
                } else if (score < 75) {
                  // FAIR: map 60-74 to 40-60%
                  heightPercent = 40 + ((score - 60) / 15) * 20;
                } else if (score < 90) {
                  // GOOD: map 75-89 to 60-80%
                  heightPercent = 60 + ((score - 75) / 15) * 20;
                } else {
                  // GREAT: map 90+ to 80-100%
                  heightPercent = 80 + ((score - 90) / 10) * 20;
                }

                return (
                  <Pressable key={bar.hour} onPress={() => setSelectedIndex(index)} className="items-center mx-1">
                    <View
                      className="w-[2.4rem] rounded-lg justify-start items-center pt-2"
                      style={{ 
                        height: `${heightPercent}%`,
                        backgroundColor: BAR_FILL_COLOR[sentiment], 
                        borderColor: isActive ? '#FFAE00' : color, 
                        borderWidth: isActive ? 2 : 1 
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
  );
}
