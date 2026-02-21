import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { LocationProvider } from '@/providers/location';
import { QueryProvider } from '@/providers/query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
    'Roboto-ExtraLight': require('../assets/fonts/Roboto-ExtraLight.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto-SemiBold.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-ExtraBold': require('../assets/fonts/Roboto-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <LocationProvider>
          <GluestackUIProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFAE00' },
              }}
            />
          </GluestackUIProvider>
        </LocationProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}