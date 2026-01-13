import type { Sentiment } from '@/components/home/sentiment';
import { StatusBadge } from '@/components/home/statusBadge';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export function ActivityHeader({ activity, status, onPlan }: { activity: string; status: Sentiment; onPlan?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-lg" style={{ fontFamily: 'Roboto-Medium' }}>{activity}</Text>
        <StatusBadge value={status} />
      </View>
      <Button size="sm" variant="solid" className="rounded-full" onPress={onPlan}>
        <ButtonText className="text-white" style={{ fontFamily: 'Roboto-Regular' }}>Plan Activity</ButtonText>
      </Button>
    </View>
  );
}
