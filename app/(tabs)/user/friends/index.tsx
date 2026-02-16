import { SearchBar } from '@/components/common/searchBar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { FriendsList, UserHeader } from '@/components/user';
import { PendingRequestsList } from '@/components/user/pendingRequestsList';
import {
  useAcceptFriendRequest,
  useFriends,
  usePendingRequests,
  useRejectFriendRequest,
} from '@/features/friends';
import { useFadeInAnimation } from '@/features/home';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';

export default function FriendsListScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const { data: friends = [], refetch: refetchFriends, isLoading: friendsLoading } = useFriends(userId);
  const { data: pendingRequests = [], refetch: refetchPendingRequests, isLoading: requestsLoading } = usePendingRequests(userId);

  const friendsFadeAnim = useFadeInAnimation({
    isLoading: friendsLoading,
    hasData: friends.length > 0,
    itemCount: friends.length,
  });

  const requestsFadeAnim = useFadeInAnimation({
    isLoading: requestsLoading,
    hasData: pendingRequests.length > 0,
    itemCount: pendingRequests.length,
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetchFriends();
        refetchPendingRequests();
      }
    }, [userId, refetchFriends, refetchPendingRequests])
  );
  const acceptRequest = useAcceptFriendRequest(userId);
  const rejectRequest = useRejectFriendRequest(userId);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const query = searchQuery.toLowerCase();
    return friends.filter((f) => f.username.toLowerCase().includes(query) || f.title.toLowerCase().includes(query));
  }, [friends, searchQuery]);

  const handleViewProfile = (friend: typeof friends[0]) => {
    router.push({
      pathname: '/user/friends/profile',
      params: {
        id: friend.id,
        name: friend.username,
        title: friend.title,
        color: 'blue',
      },
    });
  };

  const handleAcceptRequest = (requestUserId: string) => {
    acceptRequest.mutate(requestUserId, {
      onSuccess: () => {
        refetchFriends();
        refetchPendingRequests();
      },
    });
  };

  const handleRejectRequest = (requestUserId: string) => {
    rejectRequest.mutate(requestUserId, {
      onSuccess: () => {
        refetchPendingRequests();
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Friends" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-4">
          {requestsLoading ? (
            <View>
              <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
                Incoming Requests
              </Text>
              <View className="items-center justify-center py-8">
                <Spinner size="large" />
              </View>
            </View>
          ) : (
            <Animated.View style={{ opacity: requestsFadeAnim }}>
              <PendingRequestsList
                requests={pendingRequests}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            </Animated.View>
          )}

          <View className="gap-3">
            <Button onPress={() => router.push('/user/friends/add')} className="rounded-xl">
              <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Add New Friends</ButtonText>
            </Button>

            <Divider className="mt-1" />
            <Text className="text-sm text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
              Friends ({filteredFriends.length})
            </Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Find a friend by username"
            />

            {friendsLoading ? (
              <View className="items-center justify-center py-12">
                <Spinner size="large" />
              </View>
            ) : (
              <Animated.View style={{ opacity: friendsFadeAnim }}>
                <FriendsList friends={filteredFriends} onViewProfile={handleViewProfile} />
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
