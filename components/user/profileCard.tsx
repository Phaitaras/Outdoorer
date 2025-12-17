import {
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from '@/components/ui/avatar';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { SettingsIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export interface ProfileCardProps {
  name: string;
  title: string;
  avatarUri?: string;
  activities: string[];
  friendsCount: number;
  activitiesCount: number;
  reviewsCount?: number;
  showButtons?: boolean;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  onAddFriendPress?: () => void;
  onViewBookmarksPress?: () => void;
}

export function ProfileCard({
  name,
  title,
  avatarUri = '',
  activities,
  friendsCount = 0,
  activitiesCount = 0,
  reviewsCount = 0,
  showButtons = true,
  showSettings = true,
  onSettingsPress,
  onAddFriendPress,
  onViewBookmarksPress,
}: ProfileCardProps) {
  return (
    <View className="bg-white p-6 rounded-2xl shadow-soft-1">
      {/* header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className='flex-row gap-6 items-center'>
          <Avatar size='lg'>
            <AvatarFallbackText>{name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUri,
              }}
            />
          </Avatar>
          <View className='flex-col gap-[0.2rem]'>
            <Text className="text-[20px]" style={{ fontFamily: 'Roboto-Medium' }}>
              {name}
            </Text>
            <Text className="text-md text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
              {title}
            </Text>
          </View>
        </View>
        {showSettings && (
          <Button variant="link" className="px-2 self-start" onPress={onSettingsPress}>
            <ButtonIcon as={SettingsIcon} className='w-6 h-6 text-typography-600' />
          </Button>
        )}
      </View>

      {/* tags */}
      <View className="flex-row flex-wrap mb-6 gap-3">
        {activities.map((label) => (
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
        <View className="flex-col gap-1">
          <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
            {friendsCount}
          </Text>
          <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            Friends
          </Text>
        </View>
        <Divider orientation="vertical" />
        <View className="flex-col gap-1">
          <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
            {activitiesCount}
          </Text>
          <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            Activities
          </Text>
        </View>
        <Divider orientation="vertical" />
        <View className="flex-col gap-1">
          <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
            {reviewsCount}
          </Text>
          <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
            Reviews
          </Text>
        </View>
      </View>

      {/* buttons */}
      {showButtons && (
        <View className="mt-6 flex-row justify-evenly gap-4">
          <Button variant="solid" className="rounded-full" onPress={onAddFriendPress}>
            <ButtonText className="text-white" style={{ fontFamily: 'Roboto-Medium' }}>
              {showButtons ? `Add New Friend` : `Add Friend`}
            </ButtonText>
          </Button>
          {onViewBookmarksPress && (
            <Button variant="solid" className="rounded-full" onPress={onViewBookmarksPress}>
              <ButtonText className="text-white" style={{ fontFamily: 'Roboto-Medium' }}>
                View Bookmarks
              </ButtonText>
            </Button>
          )}
        </View>
      )}
    </View>
  );
}
