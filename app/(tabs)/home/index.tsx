import { ActivityList, type ActivityItem } from '@/components/home/activityList';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import { LocationHeader } from '@/components/home/locationHeader';
import type { Sentiment } from '@/components/home/sentiment';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const activities: ActivityItem[] = [
    {
      emoji: '🏃‍♂️',
      title: 'Running',
      status: 'GOOD' as Sentiment,
      next6: ['GREAT', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD'] as Sentiment[],
      windowText: '9:00 - 15:00',
      onPress: () =>
        router.push({ pathname: '/home/activity', params: { activity: 'Running', status: 'GOOD' } }),
    },
    {
      emoji: '🥾',
      title: 'Hiking',
      status: 'BAD' as Sentiment,
      next6: ['FAIR', 'FAIR', 'BAD', 'FAIR', 'FAIR', 'FAIR'] as Sentiment[],
      windowText: '10:00 - 14:00',
    },
    {
      emoji: '🏄‍♂️',
      title: 'Surfing',
      status: 'POOR' as Sentiment,
      next6: ['POOR', 'POOR', 'BAD', 'FAIR', 'FAIR', 'FAIR'] as Sentiment[],
      windowText: '13:00 - 17:00',
    },
    {
      emoji: '🪁',
      title: 'Kitesurfing',
      status: 'POOR' as Sentiment,
      next6: ['POOR', 'POOR', 'POOR', 'BAD', 'FAIR', 'FAIR'] as Sentiment[],
      windowText: '—',
    },
  ];

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
      >
        <LocationHeader
          locationLabel="Glasgow, United Kingdom"
        />
        <CurrentWeatherCard />
        <ActivityList items={activities} />
      </ScrollView>
    </View>
  );
}
