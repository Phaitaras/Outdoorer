import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { AVATAR_COLOR_HEX } from '@/constants/user';
import type { Profile } from '@/features/profile/types';
import React from 'react';
import { View } from 'react-native';

interface FriendsListProps {
  friends: Profile[];
  onViewProfile: (friend: Profile) => void;
}

export function FriendsList({ friends, onViewProfile }: FriendsListProps) {
  if (!friends || friends.length === 0) return null;

  return (
    <View className="bg-white rounded-2xl shadow-soft-1 overflow-hidden">
      {friends.map((friend, index) => (
        <React.Fragment key={friend.id}>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-4 flex-1">
              <Avatar size="md" style={{ backgroundColor: AVATAR_COLOR_HEX['blue'] }}>
                <AvatarFallbackText>{friend.username}</AvatarFallbackText>
                <AvatarImage
                  source={{ uri: '' }}
                />
              </Avatar>
              <View className="flex-col flex-1">
                <Text className="text-base" style={{ fontFamily: 'Roboto-Medium' }}>
                  {friend.username}
                </Text>
                <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                  {friend.title || 'Outdoor enthusiast'}
                </Text>
              </View>
            </View>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              className="rounded-full"
              onPress={() => onViewProfile(friend)}
            >
              <ButtonText className="text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
                View Profile
              </ButtonText>
            </Button>
          </View>
          {index < friends.length - 1 && <Divider className="mx-4" />}
        </React.Fragment>
      ))}
    </View>
  );
}
