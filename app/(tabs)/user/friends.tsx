import { FriendsList, UserHeader } from '@/components/user';
import { useFriends } from '@/features/friends';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function FriendsListScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const { data: friends = [] } = useFriends(userId);

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Friends" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <FriendsList
            friends={friends}
            onViewProfile={(friend) =>
              router.push({
                pathname: '/user/friendProfile',
                params: {
                  id: friend.id,
                  name: friend.username,
                  title: friend.title,
                  color: 'blue',
                },
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
