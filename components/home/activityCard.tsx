// components/home/activityCard.tsx
import { Text } from '@/components/ui/text';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Sentiment, SentimentRow } from './sentiment';
import { StatusBadge } from './statusBadge';
import { Skeleton } from '@/components/ui/skeleton';

export function ActivityCard({
  title,
  status,
  next6,
  windowText,
  onPress,
  isContentLoading = false,
}: {
  title: string;
  status: Sentiment;
  next6: Sentiment[];
  windowText: string;
  onPress?: () => void;
  isContentLoading?: boolean;
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      className="bg-white rounded-2xl px-4 py-4 shadow-soft-1"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            {title}
          </Text>
          {isContentLoading ? <Skeleton className="w-11 h-5 rounded-md" startColor='bg-background-100' speed={4} />
          : <StatusBadge value={status} />}
        </View>
        <ArrowRight size={18} />
      </View>

      <View className="mt-2 flex-row items-center gap-2">
        <Text className="text-sm text-typography-700 pt-1" style={{ fontFamily: 'Roboto-Regular' }}>Next 6 Hourly Window: </Text>
        {isContentLoading ? <Skeleton className="w-40 h-[20px] mt-1 rounded-md" startColor='bg-background-100' speed={4} />
        : <SentimentRow items={next6} />}
      </View>

      <Text className="text-sm text-typography-700 mt-1" style={{ fontFamily: 'Roboto-Regular' }}>
        Recommended Window: {windowText}
      </Text>
    </Container>
  );
}
