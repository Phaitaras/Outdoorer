import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonIcon } from '@/components/ui/button';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import { ActivityCard } from '@/components/home/activityCard';
import { MapPin, SlidersHorizontal, Search } from 'lucide-react-native';
import type { Sentiment } from '@/components/home/sentiment';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';

export default function Home() {
  const headerH = useHeaderHeight();
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F6F6F7]">

      <ScrollView
        className="flex-1 px-8"
        contentContainerStyle={{ paddingTop: headerH, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl mt-[-40px] mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MapPin size={18} />
              <Text className="font-roboto-medium text-[20px]">Glasgow, United Kingdom</Text>
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

        {/* WEATHER */}
        <Text className="mt-2 mb-2 text-[18px] font-roboto-bold text-typography-800">
          Hourly Weather
        </Text>
        <CurrentWeatherCard />

        {/* ACTIVITIES */}
        <Text className="mt-5 mb-2 text-[18px] font-roboto-bold text-typography-800">
          Activities
        </Text>
        <View className="gap-3 mb-4">
          <ActivityCard
            emoji="🏃‍♂️"
            title="Running"
            status="GREAT"
            next6={['IDEAL', 'GREAT', 'GREAT', 'GREAT', 'GREAT', 'GREAT'] as Sentiment[]}
            windowText="9:00 - 15:00"
            onPress={() =>
              router.push({
                pathname: '/activity',
                params: { activity: 'Running', status: 'GREAT' },
              })
            }
          />
          <ActivityCard
            emoji="🥾"
            title="Hiking"
            status="FAIR"
            next6={['GOOD', 'GOOD', 'FAIR', 'GOOD', 'GOOD', 'GOOD'] as Sentiment[]}
            windowText="10:00 - 14:00"
          />
          <ActivityCard
            emoji="🏄‍♂️"
            title="Surfing"
            status="BAD"
            next6={['BAD', 'BAD', 'FAIR', 'GOOD', 'GOOD', 'GOOD'] as Sentiment[]}
            windowText="13:00 - 17:00"
          />
          <ActivityCard
            emoji="🪁"
            title="Kitesurfing"
            status="BAD"
            next6={['BAD', 'BAD', 'BAD', 'FAIR', 'GOOD', 'GOOD'] as Sentiment[]}
            windowText="—"
          />
        </View>
      </ScrollView>
    </View>
  );
}
