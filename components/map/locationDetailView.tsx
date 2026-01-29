import { StarRating } from '@/components/common/starRating';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { AVATAR_COLOR_HEX } from '@/constants/user';
import { getAvatarColor } from '@/features/map';
import type { Profile } from '@/features/profile/types';
import { formatActivityDate, formatActivityTime } from '@/utils/activity';
import { X } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

interface LocationDetailViewProps {
  locationTitle?: string | null;
  userProfile: Profile | undefined;
  currentActivity: any;
  review: { id: number; rating: number; description: string } | null;
  isOwnActivity: boolean;
  activityLabel: string | null;
  onClose?: () => void;
  onPlanActivity?: () => void;
  onOpenReviewForm: () => void;
  onSeeReview?: () => void;
}

export function LocationDetailView({
  locationTitle,
  userProfile,
  currentActivity,
  review,
  isOwnActivity,
  activityLabel,
  onClose,
  onPlanActivity,
  onOpenReviewForm,
  onSeeReview,
}: LocationDetailViewProps) {
  const avatarColor = getAvatarColor(currentActivity?.user_id);
  const color = AVATAR_COLOR_HEX[avatarColor] || AVATAR_COLOR_HEX['blue'];

  const dateDisplay = currentActivity
    ? formatActivityDate(currentActivity.start_time)
    : 'DD/MM/YYYY';

  const timeDisplay = currentActivity
    ? formatActivityTime(currentActivity.start_time, currentActivity.end_time)
    : 'HH:MM - HH:MM';

  return (
    <View className="p-8 w-full">
      {/* avatar + header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row gap-4 items-center">
          <Avatar size="md" style={{ backgroundColor: color }}>
            <AvatarFallbackText>
              {userProfile?.username ?? 'User'}
            </AvatarFallbackText>
          </Avatar>
          <View className="flex-col gap-[0.2rem]">
            <Text className="text-[15px]" style={{ fontFamily: 'Roboto-Medium' }}>
              {userProfile?.username ?? 'User'}
            </Text>
            <Text className="text-[11.5px] text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>
              {userProfile?.title ?? 'Outdoorer'}
            </Text>
          </View>
        </View>
        {onClose && (
          <Pressable onPress={onClose} className="p-2 self-start">
            <X size={24} color="#666" />
          </Pressable>
        )}
      </View>

      {/* location title */}
      <Text size="2xl" style={{ fontFamily: 'Roboto-Medium' }} className="color-typography-800 mb-1">
        {locationTitle ?? 'Placeholder Location'}
      </Text>

      {/* rating */}
      <View className="flex-row gap-2 mb-4 items-center">
        {review ? (
          <>
            <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
              ({review.rating.toFixed(1)})
            </Text>
            <StarRating
              value={review.rating}
              readonly
              size={17}
              inactiveColor="white"
            />
          </>
        ) : (
          <Text size="sm" style={{ fontFamily: 'Roboto-Regular' }} className="color-typography-500">
            No review
          </Text>
        )}
      </View>

      {/* activity tag */}
      {activityLabel && (
        <Button
          variant="outline"
          action="secondary"
          size="sm"
          className="rounded-3xl mb-4 self-start"
        >
          <ButtonText className="text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
            {activityLabel}
          </ButtonText>
        </Button>
      )}

      {/* date and time */}
      <View className="flex-row gap-8 mb-6">
        <View className="flex-col">
          <Text className="text-typography-600" style={{ fontFamily: 'Roboto-Medium' }}>
            Date
          </Text>
          <Text className="text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>
            {dateDisplay}
          </Text>
        </View>
        <View className="flex-col">
          <Text className="text-typography-600" style={{ fontFamily: 'Roboto-Medium' }}>
            Time
          </Text>
          <Text className="text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>
            {timeDisplay}
          </Text>
        </View>
      </View>

      {/* action buttons */}
      <View className="flex-row justify-center gap-4 mt-1">
        <Button variant="solid" size="md" className="px-6 rounded-full" onPress={onPlanActivity}>
          <Text style={{ fontFamily: 'Roboto-Medium', color: '#FFFFFF' }}>Check Forecast</Text>
        </Button>
        {isOwnActivity ? (
          <Button variant="outline" size="md" className="px-6 rounded-full" onPress={onOpenReviewForm}>
            <Text style={{ fontFamily: 'Roboto-Medium' }}>
              {review ? 'Edit Review' : 'Leave a Review'}
            </Text>
          </Button>
        ) : (
          <Button variant="outline" size="md" className="px-6 rounded-full" onPress={onSeeReview}>
            <Text style={{ fontFamily: 'Roboto-Medium' }}>See Review</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
