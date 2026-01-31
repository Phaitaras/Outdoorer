import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import { Text } from '@/components/ui/text';
import type { Activity } from '@/features/profile/types';
import { activityToCard } from '@/features/profile/utils';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

interface PreviousActivitiesProps {
  activities: Activity[] | undefined;
  onViewAll: () => void;
  onCardPress: (activityId: string, activityName: string) => void;
}

export function PreviousActivities({ activities, onViewAll, onCardPress }: PreviousActivitiesProps) {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-typography-800 text-lg" style={{ fontFamily: 'Roboto-Medium' }}>
          Previous Activities
        </Text>
        <Pressable onPress={onViewAll}>
          <ChevronRightIcon className="w-6 h-6 text-typography-400" />
        </Pressable>
      </View>
      <ActivityCardsScroll
        cards={activities?.map(activityToCard) ?? []}
        onCardPress={(card) => onCardPress(card.id, card.activity)}
        emptyMessage="No recent activities"
      />
    </View>
  );
}
