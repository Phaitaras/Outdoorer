import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { AVATAR_COLOR_HEX, AvatarColor } from '@/constants/user';
import { getAvatarColor } from '@/features/map';
import { type ProfileWithStats } from '@/features/profile';
import React from 'react';
import { Pressable, View } from 'react-native';
import { ProfileCardSkeleton } from './profileCardSkeleton';

export interface ProfileCardProps {
  profile?: ProfileWithStats;
  isLoading?: boolean;
  avatarColor?: AvatarColor;
  avatarUri?: string;
  onSettingsPress?: () => void;
  onAddFriendPress?: () => void;
  addFriendLabel?: string;
  addFriendVariant?: 'solid' | 'outline' | 'link';
  addFriendDisabled?: boolean;
  onViewBookmarksPress?: () => void;
  onFriendsPress?: () => void;
  onActivitiesPress?: () => void;
  onReviewsPress?: () => void;
  hideActivitiesCount?: boolean;
}

export function ProfileCard({
  profile,
  isLoading,
  avatarColor,
  avatarUri = '',
  onSettingsPress,
  onAddFriendPress,
  addFriendLabel,
  addFriendVariant = 'solid',
  addFriendDisabled = false,
  onFriendsPress,
  onActivitiesPress,
  onReviewsPress,
  hideActivitiesCount = false,
}: ProfileCardProps) {
  if (isLoading || !profile) {
    return <ProfileCardSkeleton />;
  }

  const computedAvatarColor = avatarColor ?? getAvatarColor(profile.id);
  const color = AVATAR_COLOR_HEX[computedAvatarColor] || AVATAR_COLOR_HEX['blue'];
  const activityLabels = profile.activity_types
    .map(type => LABEL_TO_ACTIVITY[type])
    .filter(Boolean);

  const friendButtonTextClass = addFriendVariant === 'outline'
    ? 'text-typography-700'
    : 'text-white';

  return (
    <View className="bg-white p-6 rounded-2xl shadow-soft-1">
      {/* header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className='flex-row gap-6 items-center'>
          <Avatar size='lg' style={{ backgroundColor: color }}>
            <AvatarFallbackText>{profile.username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUri,
              }}
            />
          </Avatar>
          <View className='flex-col gap-[0.2rem]'>
            <Text className="text-[20px]" style={{ fontFamily: 'Roboto-Medium' }}>
              {profile.username}
            </Text>
            <Text className="text-md text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
              {profile.title}
            </Text>
          </View>
        </View>
      </View>

      {/* tags */}
      <View className="flex-row flex-wrap mb-6 gap-3">
        {activityLabels.map((label) => (
          <Button
            key={label}
            variant="outline"
            action="secondary"
            size="sm"
            className="rounded-3xl"
          >
            <ButtonText className="text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              {label}
            </ButtonText>
          </Button>
        ))}
      </View>

      {/* stats count */}
      <View className="flex-row gap-6">
        <Pressable onPress={onFriendsPress} className="flex-col gap-1">
          <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
            {profile.friendCount}
          </Text>
          <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            Friends
          </Text>
        </Pressable>
        {!hideActivitiesCount && (
          <>
            <Divider orientation="vertical" />
            <Pressable onPress={onActivitiesPress} className="flex-col gap-1">
              <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
                {profile.activityCount}
              </Text>
              <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
                Activities
              </Text>
            </Pressable>
          </>
        )}
        <Divider orientation="vertical" />
        <Pressable onPress={onReviewsPress} className="flex-col gap-1">
          <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
            {profile.reviewCount}
          </Text>
          <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            Reviews
          </Text>
        </Pressable>
      </View>

      {/* action button */}
      {onAddFriendPress && addFriendLabel && (
        <Button
          variant={addFriendVariant}
          className="mt-6 rounded-full self-center"
          onPress={onAddFriendPress}
          disabled={addFriendDisabled}
        >
          <ButtonText className={friendButtonTextClass} style={{ fontFamily: 'Roboto-Medium' }}>
            {addFriendLabel}
          </ButtonText>
        </Button>
      )}
    </View>
  );
}
