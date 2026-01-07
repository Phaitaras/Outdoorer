import { ActivityList, type ActivityItem } from '@/components/home/activityList';
import { CurrentWeatherCard, type WeatherData } from '@/components/home/currentWeatherCard';
import { LocationHeader } from '@/components/home/locationHeader';
import type { Sentiment } from '@/components/home/sentiment';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  const fetchWeather6h = async (latitude: number, longitude: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-weather-6h', {
      body: { lat: latitude, lon: longitude },
    });
    console.log(latitude, longitude);

    if (error) throw error;
    setWeatherData(data);
    return data;
  } catch (err) {
    console.error('Weather fetch failed:', err);
    Alert.alert('Error', 'Could not fetch weather');
  }
};

  const [items, setItems] = useState<ActivityItem[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(undefined);

  // Request location and store user's coordinates
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    fetchWeather6h(userLocation.latitude, userLocation.longitude);
  }, [userLocation]);

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
