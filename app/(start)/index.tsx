import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FFAE00]">
      <Image
        source={require('../../assets/images/full_icon.png')}
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[120px] w-[260px] h-[260px] z-20"
        resizeMode="contain"
      />
      <View className="relative w-full flex-1 justify-end">

        <View className="w-full h-[50%] bg-white rounded-t-[30px] px-12 pt-[30%] pb-12 shadow-lg">
          <View className="mb-8 flex-col justify-center items-center gap-1">
            <Text size="2xl" style={{ fontFamily: 'Roboto-Bold' }}>
              Outdoorer
            </Text>
            <Text size="md" style={{ fontFamily: 'Roboto-Regular' }}>
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
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
              Sign In
            </ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
