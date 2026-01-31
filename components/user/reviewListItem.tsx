import { StarRating } from '@/components/common/starRating';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export interface ReviewListItemProps {
  id: number;
  activityName: string;
  locationName: string;
  rating: number;
  dateTime: string;
  isLast: boolean;
  onPress: () => void;
}

export function ReviewListItem({
  activityName,
  locationName,
  rating,
  dateTime,
  isLast,
  onPress,
}: ReviewListItemProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between p-5 active:bg-background-50"
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View className="flex-col flex-1">
            <Text className="text-base text-typography-900" style={{ fontFamily: 'Roboto-Medium' }}>
              {activityName}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                {locationName}
              </Text>
              <Text className="text-sm text-typography-400">•</Text>
              <StarRating
                value={rating}
                readonly
                size={14}
                inactiveColor="#E5E7EB"
              />
            </View>
            <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              {dateTime}
            </Text>
          </View>
        </View>
        <ChevronRightIcon className="w-5 h-5 text-typography-400 ml-2" />
      </Pressable>
      {!isLast && <Divider className="mx-5" />}
    </>
  );
}
