import type { Sentiment } from '@/components/home/sentiment';
import { StatusBadge } from '@/components/home/statusBadge';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';

export function ActivityHeader({ 
  activity, 
  status, 
  onPlan,
  hasReview,
  reviewId,
  activityId,
  activityEndTime,
}: { 
  activity: string; 
  status: Sentiment; 
  onPlan?: () => void;
  hasReview?: boolean;
  reviewId?: number | null;
  activityId?: string;
  activityEndTime?: string | null;
}) {
  const router = useRouter();

  const isActivityCompleted = useMemo(() => {
    if (!activityId || !activityEndTime) return false;
    return new Date(activityEndTime) < new Date();
  }, [activityId, activityEndTime]);

  const handleButtonPress = () => {
    if (isActivityCompleted && reviewId) {
      router.push({ pathname: '/user/reviewDetail', params: { id: reviewId.toString() } });
    } else if (isActivityCompleted && activityId && !hasReview) {
      // no review yet, create one
      router.push({ pathname: '/user/reviewDetail', params: { activityId: activityId.toString() } });
    } else {
      onPlan?.();
    }
  };

  const buttonText = isActivityCompleted
    ? (hasReview ? 'Edit Review' : 'Leave Review')
    : 'Plan Activity';

  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-lg" style={{ fontFamily: 'Roboto-Medium' }}>{activity}</Text>
        <StatusBadge value={status} />
      </View>
      <Button size="sm" variant="solid" className="rounded-full" onPress={handleButtonPress}>
        <ButtonText className="text-white" style={{ fontFamily: 'Roboto-Regular' }}>{buttonText}</ButtonText>
      </Button>
    </View>
  );
}
