import { SentimentIcon, type Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import { useModalTransitionAnimation } from '@/features/home/hooks/useModalTransitionAnimation';
import { X } from 'lucide-react-native';
import React from 'react';
import { Animated, Pressable, View } from 'react-native';
import { BAR_FILL_COLOR, BAR_HEIGHT_CLASS, SENTIMENT_COLORS } from './constants';

export function FigureModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { shouldRender, backdropOpacity, contentOpacity } = useModalTransitionAnimation({ visible });
  if (!shouldRender) return null;

  return (
    <Animated.View className="absolute inset-0 bg-black/40 items-center justify-center px-6" style={{ opacity: backdropOpacity }}>
      <Animated.View className="bg-[#F6F6F7] rounded-2xl w-full px-4 py-4" style={{ opacity: contentOpacity }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-md" style={{ fontFamily: 'Roboto-Medium' }}>Graph Figures</Text>
          <Pressable onPress={onClose}>
            <X size={20} />
          </Pressable>
        </View>

        <View className="flex-row justify-center gap-4">
          <View className="flex flex-col items-center gap-1">
            <View className="px-2 py-1 rounded-lg bg-[#FFAE00]">
              <Text className="text-xs text-white" style={{ fontFamily: 'Roboto-Medium' }}>
                9:00
              </Text>
            </View>
            <Text className="text-xs text-typography-700" style={{ fontFamily: 'Roboto-Regular' }}>Selected</Text>
          </View>
          <View className="flex flex-col items-center gap-1">
            <View className="px-2 py-1 rounded-lg bg-gray-200">
              <Text className="text-xs text-typography-700" style={{ fontFamily: 'Roboto-Regular' }}>11:00</Text>
            </View>
            <Text className="text-xs text-typography-700" style={{ fontFamily: 'Roboto-Regular' }}>Recommended</Text>
          </View>
        </View>

        <Text className="text-sm text-typography-700 mt-4 mb-6 px-12 text-center" style={{ fontFamily: 'Roboto-Regular' }}>
          Time windows highlighted in gray are the reccommended time windows for your activity.
        </Text>

        <View className="flex-row items-end justify-center mt-4 mb-2">
          {(['POOR', 'BAD', 'FAIR', 'GOOD', 'GREAT'] as Sentiment[]).map((s) => {
            return (
              <View key={s} className="items-center mx-1">
                <View
                  className={`w-[2.4rem] rounded-lg justify-start items-center pt-2 ${BAR_HEIGHT_CLASS[s]}`}
                  style={{
                    backgroundColor: BAR_FILL_COLOR[s],
                    borderColor: SENTIMENT_COLORS[s],
                    borderWidth: 1,
                  }}
                >
                  <SentimentIcon value={s} />
                </View>

                <Text className="mt-1 text-[10px] text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
                  {s}
                </Text>
              </View>
            );
          })}
        </View>

        <Text className="text-sm text-typography-700 mt-4 mb-6 px-12 text-center" style={{ fontFamily: 'Roboto-Regular' }}>
          Each time window is rated using a heuristic, rule-based scoring that takes weather factors into account.
          Severe or activity-specific unsafe conditions result in a “Poor” rating.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
