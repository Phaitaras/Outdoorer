// components/home/activityCard.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowRight } from 'lucide-react-native';
import { StatusBadge } from './statusBadge';
import { SentimentRow, Sentiment } from './sentiment';

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
          <Text className="text-md font-roboto-medium">
            {emoji}  {title}
          </Text>
          <StatusBadge value={status} />
        </View>
        <ArrowRight size={18} />
      </View>

      <View className="mt-2 flex-row items-center gap-2">
        <Text className="text-sm text-typography-700 pt-1">Next 6h:</Text>
        <SentimentRow items={next6} />
      </View>

      <Text className="text-sm text-typography-700 mt-1">
        Ideal Window: {windowText}
      </Text>
    </Container>
  );
}
