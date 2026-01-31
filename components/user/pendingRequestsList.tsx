import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { AVATAR_COLOR_HEX } from '@/constants/user';
import type { Profile } from '@/features/profile/types';
import { Check, X } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface PendingRequestsListProps {
  requests: Profile[];
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
  isLoading?: boolean;
}

export function PendingRequestsList({ requests, onAccept, onReject, isLoading = false }: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <View>
        <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
          Incoming Requests
        </Text>
        <Text className="text-sm text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>
          You have no pending friend requests.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
        Incoming Requests ({requests.length})
      </Text>

      <View className="bg-white rounded-2xl shadow-soft-1 overflow-hidden">
        {requests.map((profile, index) => (
          <React.Fragment key={profile.id}>
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-4 flex-1">
                <Avatar size="md" style={{ backgroundColor: AVATAR_COLOR_HEX['blue'] }}>
                  <AvatarFallbackText>{profile.username}</AvatarFallbackText>
                  <AvatarImage source={{ uri: '' }} />
                </Avatar>
                <View className="flex-col flex-1">
                  <Text className="text-base" style={{ fontFamily: 'Roboto-Medium' }}>
                    {profile.username}
                  </Text>
                  <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                    Sent you a request
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Button
                  size="sm"
                  variant="solid"
                  action="positive"
                  className="rounded-full"
                  onPress={() => onAccept(profile.id)}
                  disabled={isLoading}
                >
                  <ButtonIcon as={Check} size="sm" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  action="secondary"
                  className="rounded-full"
                  onPress={() => onReject(profile.id)}
                  disabled={isLoading}
                >
                  <ButtonIcon as={X} size="sm" />
                </Button>
              </View>
            </View>
            {index < requests.length - 1 && <Divider className="mx-4" />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
