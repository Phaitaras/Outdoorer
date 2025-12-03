import { ActivityCard } from '@/components/home/activityCard';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import type { Sentiment } from '@/components/home/sentiment';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">

      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MapPin size={18} />
              <Text className="text-[20px]" style={{fontFamily: 'Roboto-Medium'}}>Glasgow, United Kingdom</Text>
            </View>
            <Button variant="solid" size="xs" className="px-2 rounded-md">
              <ButtonIcon as={SlidersHorizontal} />
            </Button>
          </View>
          <View className="mt-3">
            <Input className="rounded-xl" size='sm'>
              <InputField placeholder=" Specify a destination" className="pl-2 text-sm" />
              <Button variant="link" size="sm" className="mr-2">
                <ButtonIcon as={Search} />
              </Button>
            </Input>
          </View>
        </View>

        <Text className="mt-2 mb-2 text-[18px] text-typography-800" style={{fontFamily: 'Roboto-Bold'}}>
          Hourly Weather
        </Text>
        <CurrentWeatherCard />

        <Text className="mt-5 mb-2 text-[18px] text-typography-800" style={{fontFamily: 'Roboto-Bold'}}>
          Activities
        </Text>
        <View className="gap-3 mb-4">
          <ActivityCard
            emoji="🏃‍♂️"
            title="Running"
            status="GOOD"
            next6={['GREAT', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD'] as Sentiment[]}
            windowText="9:00 - 15:00"
            onPress={() =>
              router.push({
                pathname: '/home/activity',
                params: { activity: 'Running', status: 'GOOD' },
              })
            }
          />
          <ActivityCard
            emoji="🥾"
            title="Hiking"
            status="BAD"
            next6={['FAIR', 'FAIR', 'BAD', 'FAIR', 'FAIR', 'FAIR'] as Sentiment[]}
            windowText="10:00 - 14:00"
          />
          <ActivityCard
            emoji="🏄‍♂️"
            title="Surfing"
            status="POOR"
            next6={['POOR', 'POOR', 'BAD', 'FAIR', 'FAIR', 'FAIR'] as Sentiment[]}
            windowText="13:00 - 17:00"
          />
          <ActivityCard
            emoji="🪁"
            title="Kitesurfing"
            status="POOR"
            next6={['POOR', 'POOR', 'POOR', 'BAD', 'FAIR', 'FAIR'] as Sentiment[]}
            windowText="—"
          />
        </View>
      </ScrollView>
    </View>
  );
}
