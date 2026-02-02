import { LocationModalLocation, REVIEW_QUERY_KEYS } from '@/features/map';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Keyboard } from 'react-native';

interface UseLocationModalAnimationProps {
  location: LocationModalLocation | null;
}

export function useLocationModalAnimation({ location }: UseLocationModalAnimationProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const horizontalSlideAnim = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationModalLocation | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShow.remove();
      keyboardWillHide.remove();
    };
  }, [backgroundOpacity]);

  useEffect(() => {
    if (location) {
      setCurrentLocation(location);
      setIsVisible(true);
      horizontalSlideAnim.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        setCurrentLocation(null);
      });
    }
  }, [location, slideAnim, horizontalSlideAnim, isVisible]);

  const handleOpenReviewForm = () => {
    setShowReviewForm(true);
    const screenWidth = Dimensions.get('window').width;
    Animated.timing(horizontalSlideAnim, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseReviewForm = () => {
    Animated.timing(horizontalSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => setShowReviewForm(false), 300);
  };

  return {
    slideAnim,
    horizontalSlideAnim,
    backgroundOpacity,
    isVisible,
    currentLocation,
    showReviewForm,
    handleOpenReviewForm,
    handleCloseReviewForm,
  };
}

interface UseLocationModalDataProps {
  currentLocation: LocationModalLocation | null;
  currentUserId: string | null;
}

const LABEL_TO_ACTIVITY: Record<string, string> = {
  'hiking': 'Hiking',
  'biking': 'Biking',
  'camping': 'Camping',
  'fishing': 'Fishing',
  'climbing': 'Climbing',
  'kayaking': 'Kayaking',
  'skiing': 'Skiing',
  'surfing': 'Surfing',
};

async function fetchActivityReview(activityId: string) {
  const { data, error } = await supabase
    .from('review')
    .select('id, rating, description')
    .eq('activity_id', activityId)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export function useLocationModalData({ currentLocation, currentUserId }: UseLocationModalDataProps) {
  const currentActivity = currentLocation?.activity;
  const { data: latestReview, refetch: refetchReview } = useQuery({
    queryKey: [REVIEW_QUERY_KEYS.ACTIVITY_REVIEW, currentActivity?.id],
    queryFn: () => fetchActivityReview(String(currentActivity?.id)),
    enabled: !!currentActivity?.id,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
  });

  const review = useMemo(() => {
    if (latestReview) return latestReview;
    if (!currentActivity?.review || !Array.isArray(currentActivity.review) || currentActivity.review.length === 0) {
      return null;
    }
    return currentActivity.review[0];
  }, [currentActivity?.review, latestReview]);

  const isOwnActivity = useMemo(() => {
    return !!(currentUserId && currentActivity?.user_id === currentUserId);
  }, [currentUserId, currentActivity?.user_id]);

  const activityLabel = useMemo(() => {
    if (!currentActivity?.activity_type) return null;
    return LABEL_TO_ACTIVITY[currentActivity.activity_type];
  }, [currentActivity?.activity_type]);

  return {
    currentActivity,
    review,
    isOwnActivity,
    activityLabel,
    refetchReview,
  };
}
