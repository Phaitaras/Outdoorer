import { ActivityList, type ActivityItem } from '@/components/home/activityList';
import { CurrentWeatherCard } from '@/components/home/currentWeatherCard';
import { LocationHeader } from '@/components/home/locationHeader';
import type { Sentiment } from '@/components/home/sentiment';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useWeather } from '@/features/weather';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { location } = useLocationContext();
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('profile')
        .select('activity_types')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setItems([]);
        return;
      }

      const next6: Sentiment[] = ['GREAT', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD'];
      const windowText = '9:00 - 15:00';

      const built: ActivityItem[] = (data.activity_types ?? [])
        .map((enumVal: string) => {
          const title = LABEL_TO_ACTIVITY[enumVal];
          if (!title) return null;
          return {
            emoji: '',
            title,
            status: 'GOOD' as Sentiment,
            next6,
            windowText,
            onPress: () =>
              router.push({ pathname: '/home/activity', params: { activity: title, status: 'GOOD' } }),
          } as ActivityItem;
        })
        .filter(Boolean) as ActivityItem[];

      setItems(built);
    };

    load();
  }, [LABEL_TO_ACTIVITY, router]);

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
      >
        <LocationHeader
          locationLabel="Glasgow, United Kingdom"
        />
        <CurrentWeatherCard weather={weatherData} />
        <ActivityList items={items} />
      </ScrollView>
    </View>
  );
}
