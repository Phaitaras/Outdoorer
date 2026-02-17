import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { permissionStatus, refresh } = useLocationContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  async function checkOnboardingStatus(userId: string) {
    const { data, error } = await supabase
      .from('profile')
      .select('onboarded')
      .eq('id', userId)
      .single();

    if (error || !data) {
      router.replace('/getting-started');
      return;
    }

    if (data.onboarded) {
      if (permissionStatus === 'unknown') {
        try {
          await refresh();
        } catch (error) {
          console.error('Location permission request failed:', error);
        }
      }
      router.replace('/(tabs)/home');
    } else {
      router.replace('/getting-started');
    }
  }

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkOnboardingStatus(user.id);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 100);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <View className="flex-1 bg-[#FFAE00]">
      <Image
        source={require('../../assets/images/full_icon.png')}
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[120px] w-[260px] h-[260px] z-20"
        resizeMode="contain"
      />
      <View className="relative w-full flex-1 justify-end">

        <View className="w-full h-[50%] bg-white rounded-t-[30px] px-12 pt-[30%]">
          <View className="mb-6 flex-col justify-center items-center gap-2">
            <Text size="3xl" style={{ fontFamily: 'Roboto-Bold' }}>
              Outdoorer
            </Text>
            <Text size="md" style={{ fontFamily: 'Roboto-Regular' }}>
              Forecast for all your outdoor activities
            </Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Button
              variant="solid"
              size="md"
              action="negative"
              className="bg-tertiary-400 rounded-lg"
              onPress={() => router.push('/signin')}
            >
              <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                Sign In
              </ButtonText>
            </Button>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
