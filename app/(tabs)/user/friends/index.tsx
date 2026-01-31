import { SearchBar } from '@/components/common/searchBar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { FriendsList, UserHeader } from '@/components/user';
import { PendingRequestsList } from '@/components/user/pendingRequestsList';
import {
  useAcceptFriendRequest,
  useFriends,
  usePendingRequests,
  useRejectFriendRequest,
} from '@/features/friends';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

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

  const { data: friends = [], refetch: refetchFriends } = useFriends(userId);
  const { data: pendingRequests = [], refetch: refetchPendingRequests } = usePendingRequests(userId);

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
          <PendingRequestsList
            requests={pendingRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />

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

            <FriendsList friends={filteredFriends} onViewProfile={handleViewProfile} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
