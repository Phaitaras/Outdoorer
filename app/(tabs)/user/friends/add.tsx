import { SearchBar } from '@/components/common/searchBar';
import { Text } from '@/components/ui/text';
import { FriendsList, UserHeader } from '@/components/user';
import { useSearchUsers } from '@/features/friends';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function AddFriendScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results = [], isLoading } = useSearchUsers(searchQuery);

  const subtitle = useMemo(() => {
    if (!searchQuery) return 'Search for a username to find friends';
    if (isLoading) return 'Searching...';
    if (results.length === 0) return 'No users found';
    return `Found ${results.length} user${results.length > 1 ? 's' : ''}`;
  }, [searchQuery, isLoading, results.length]);

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Add Friend" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-6">
          <View>
            <Text className="text-sm text-typography-700 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
              Search by username
            </Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Enter username"
            />
          </View>

          <View>
            <Text className="text-sm text-typography-600 mb-3" style={{ fontFamily: 'Roboto-Regular' }}>
              {subtitle}
            </Text>
            <FriendsList
              friends={results}
              onViewProfile={(friend) =>
                router.push({
                  pathname: '/user/friends/profile',
                  params: { id: friend.id, name: friend.username, title: friend.title, color: 'blue' },
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
