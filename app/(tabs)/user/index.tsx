import { Divider } from '@/components/ui/divider';
import { PreviousActivities, ProfileCard, UpcomingActivities } from '@/components/user';
import { useProfile, useUserActivities } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function User() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  const { data: profile } = useProfile(userId);
  const { data: upcomingActivities } = useUserActivities({
    userId: userId ?? '',
    type: 'upcoming',
    limit: 3,
  });
  const { data: previousActivities } = useUserActivities({
    userId: userId ?? '',
    type: 'previous',
    limit: 3,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View className="flex-col">
          <View className="mb-6">
            {profile && (
              <ProfileCard
                profile={profile}
                onSettingsPress={() => router.push('/user/settings')}
                onAddFriendPress={() => router.push('/user/friends/add')}
                onViewBookmarksPress={() => {
                  // TODO: Navigate to bookmarks
                }}
                onFriendsPress={() => router.push('/user/friends')}
                onActivitiesPress={() => router.push('/user/previousActivities')}
              />
            )}
          </View>

          <Divider className="mb-4" />

          <UpcomingActivities
            activities={upcomingActivities}
            onViewAll={() => router.push('/user/upcomingActivities')}
            onCardPress={(activityName) =>
              router.push({ pathname: '/(tabs)/activity', params: { activity: activityName } })
            }
          />

          <PreviousActivities
            activities={previousActivities}
            onViewAll={() => router.push('/user/previousActivities')}
            onCardPress={(activityName) =>
              router.push({ pathname: '/(tabs)/activity', params: { activity: activityName } })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
