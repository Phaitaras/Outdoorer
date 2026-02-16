import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseFadeInAnimationProps {
  isLoading: boolean;
  hasData: boolean;
  itemCount: number;
  duration?: number;
}

export function useFadeInAnimation({
  isLoading,
  hasData,
  itemCount,
  duration = 300,
}: UseFadeInAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      fadeAnim.setValue(0);
      return;
    }
    if (itemCount > 0) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
      return;
    }
    fadeAnim.setValue(1);
  }, [isLoading, hasData, itemCount, duration, fadeAnim]);

  return fadeAnim;
}
