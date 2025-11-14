import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    // 3) prevent stray scrollbars on web
    <View className="flex-1 bg-[#FFAE00] overflow-hidden">
      {/* 1) clamp to a phone-sized column in the center */}
      <View className="w-full max-w-[430px] self-center flex-1">
        {/* Floating top icon (no min-w/min-h) */}
        <View
          className="absolute left-1/2 -translate-x-1/2 top-[28vh] z-10"
          pointerEvents="none"
        >
          <Image
            source={require('../../assets/images/full_icon.png')}
            className="w-[320px] h-[320px]"     // 2) fixed, won’t force horizontal scroll
            resizeMode="contain"
          />
        </View>

        <View className="flex-1" />

        <View className="flex-[0.8] gap-6 bg-white rounded-t-[30px] p-12 shadow-lg">
          <View className="mt-20 flex-col justify-center items-center gap-1">
            <Text size="2xl" className="font-roboto-bold">Outdoorer</Text>
            <Text size="md" className="font-roboto">
              Weather forecast for all your outdoor activities
            </Text>
          </View>

          <Button
            variant="solid"
            size="md"
            action="negative"
            className="bg-tertiary-400 rounded-lg"
            onPress={() => router.push('/signin')}
          >
            <ButtonText className="font-roboto-medium">Sign In</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
