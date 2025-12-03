// components/home/activityCard.tsx
import { Text } from '@/components/ui/text';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Sentiment, SentimentRow } from './sentiment';
import { StatusBadge } from './statusBadge';

export function ActivityCard({
  emoji,
  title,
  status,
  next6,
  windowText,
  onPress,
}: {
  emoji: string;
  title: string;
  status: Sentiment;
  next6: Sentiment[];
  windowText: string;
  onPress?: () => void;
}) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className="bg-white rounded-2xl px-4 py-4 shadow-soft-1 border border-outline-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-md" style={{fontFamily: 'Roboto-Medium'}}>
            {emoji}  {title}
          </Text>
          <StatusBadge value={status} />
        </View>
        <ArrowRight size={18} />
      </View>

      <View className="mt-2 flex-row items-center gap-2">
        <Text className="text-sm text-typography-700 pt-1" style={{fontFamily: 'Roboto-Regular'}}>Next 6h:</Text>
        <SentimentRow items={next6} />
      </View>

      <Text className="text-sm text-typography-700 mt-1" style={{fontFamily: 'Roboto-Regular'}}>
        Great Window: {windowText}
      </Text>
    </Container>
  );
}
