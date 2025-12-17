import {
    Avatar,
    AvatarFallbackText,
    AvatarImage
} from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { UserHeader } from '@/components/user/userHeader';
import { AVATAR_COLOR_HEX, MOCK_FRIENDS } from '@/constants/user';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function FriendsListScreen() {
  const router = useRouter();
  const friends = MOCK_FRIENDS;

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Friends" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {friends.length > 0 ? (
            <View className="bg-white rounded-2xl shadow-soft-1 overflow-hidden">
              {friends.map((friend, index) => (
                <React.Fragment key={friend.id}>
                  <View className="flex-row items-center justify-between p-4">
                    <View className="flex-row items-center gap-4 flex-1">
                      <Avatar size="md" style={{ backgroundColor: AVATAR_COLOR_HEX[friend.avatarColor] }}>
                        <AvatarFallbackText>{friend.name}</AvatarFallbackText>
                        <AvatarImage
                          source={{
                            uri: friend.avatarUri || '',
                          }}
                        />
                      </Avatar>
                      <View className="flex-col flex-1">
                        <Text className="text-base" style={{ fontFamily: 'Roboto-Medium' }}>
                          {friend.name}
                        </Text>
                        <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                          {friend.title}
                        </Text>
                      </View>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      action="secondary"
                      className="rounded-full"
                      onPress={() => router.push(`/user/friendProfile?id=${friend.id}&name=${friend.name}&title=${friend.title}&color=${friend.avatarColor}`)}
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
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
                No friends yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
