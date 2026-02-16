import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import type { Activity } from '@/features/profile/types';
import { activityToCard } from '@/features/profile/utils';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Animated, Pressable, View } from 'react-native';

interface PreviousActivitiesProps {
  activities: Activity[] | undefined;
  isLoading?: boolean;
  fadeAnim?: Animated.Value;
  onViewAll: () => void;
  onCardPress: (activityId: string, activityName: string) => void;
}

export function PreviousActivities({ activities, isLoading, fadeAnim, onViewAll, onCardPress }: PreviousActivitiesProps) {
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
      {isLoading ? (
        <View className="items-center justify-center py-12">
          <Spinner size="large" />
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <ActivityCardsScroll
            cards={activities?.map(activityToCard) ?? []}
            onCardPress={(card) => onCardPress(card.id, card.activity)}
            emptyMessage="No recent activities"
          />
        </Animated.View>
      )}
    </View>
  );
}
