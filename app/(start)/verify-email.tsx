import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

export default function VerifyEmail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [countdown, setCountdown] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function resendVerification() {
    if (!email) {
      Alert.alert('Error', 'Email address not found. Please register again.');
      return;
    }

    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    setIsResending(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Verification email sent! Please check your inbox.');
      setCountdown(120);
    }
  }

  return (
    <View className="flex-1 bg-[#FFAE00]">
      <Image
        source={require('../../assets/images/full_icon.png')}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-[120px] w-[260px] h-[260px] z-20"
        resizeMode="contain"
      />
      <View className="relative w-full flex-1 justify-end">
        <View className="w-full h-[80%] bg-white rounded-t-[30px] px-12 pt-[30%] pb-12 shadow-lg">
          <Text size="2xl" className="mb-3" style={{ fontFamily: 'Roboto-Bold' }}>
            Verify Your Email
          </Text>
          <Text className="text-typography-700 mb-1" style={{ fontFamily: 'Roboto-Regular' }}>
            A verification link has been sent to:
          </Text>
          <Text className="text-typography-900 mb-9" style={{ fontFamily: 'Roboto-Medium' }}>
            {email || 'your email'}
          </Text>
          <Text className="text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Regular' }}>
            Please confirm your account, then return to sign in.
          </Text>

          <Button
            variant="outline"
            size="md"
            className="rounded-lg mb-3"
            onPress={resendVerification}
            disabled={countdown > 0 || isResending}
          >
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
              {countdown > 0 
                ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                : isResending 
                  ? 'Sending...'
                  : 'Resend Verification Email'}
            </ButtonText>
          </Button>

          <Button
            variant="solid"
            size="md"
            action="primary"
            className="bg-tertiary-400 rounded-lg"
            onPress={() => router.push('/signin')}
          >
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Back to Sign In</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
