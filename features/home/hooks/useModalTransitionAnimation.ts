import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface UseModalTransitionAnimationProps {
  visible: boolean;
  duration?: number;
  enableSlide?: boolean;
  slideDistance?: number;
}

export function useModalTransitionAnimation({
  visible,
  duration = 300,
  enableSlide = false,
  slideDistance = 32,
}: UseModalTransitionAnimationProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(enableSlide ? slideDistance : 0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      backdropOpacity.setValue(0);
      contentOpacity.setValue(0);
      if (enableSlide) {
        translateY.setValue(slideDistance);
      } else {
        translateY.setValue(0);
      }

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: enableSlide ? slideDistance : 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldRender(false);
      }
    });
  }, [visible, duration, enableSlide, slideDistance, backdropOpacity, contentOpacity, translateY]);

  return {
    shouldRender,
    backdropOpacity,
    contentOpacity,
    translateY,
  };
}
