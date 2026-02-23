import { Button, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { PreviousActivities, ProfileCard, UpcomingActivities } from '@/components/user';
import { useFadeInAnimation } from '@/features/home';
import { useProfile, useUserActivities } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SettingsIcon } from '@/components/ui/icon';
import { UsersRound } from 'lucide-react-native';

export default function User() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useProfile(userId);
  const {
    data: upcomingActivities,
    isLoading: upcomingLoading,
    refetch: refetchUpcomingActivities,
  } = useUserActivities({
    userId: userId ?? '',
    type: 'upcoming',
    limit: 3,
  });
  const {
    data: previousActivities,
    isLoading: previousLoading,
    refetch: refetchPreviousActivities,
  } = useUserActivities({
    userId: userId ?? '',
    type: 'previous',
    limit: 3,
  });

  const upcomingFadeAnim = useFadeInAnimation({
    isLoading: upcomingLoading,
    hasData: !!upcomingActivities,
    itemCount: upcomingActivities?.length ?? 0,
  });

  const previousFadeAnim = useFadeInAnimation({
    isLoading: previousLoading,
    hasData: !!previousActivities,
    itemCount: previousActivities?.length ?? 0,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;

      refetchProfile();
      refetchUpcomingActivities();
      refetchPreviousActivities();
    }, [userId, refetchProfile, refetchUpcomingActivities, refetchPreviousActivities])
  );

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 px-8 pt-3 pb-8"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View className="flex-col">
          <View className="mb-6">
            <View className="flex-row justify-end items-center gap-3 pb-3">
            <Button variant="link" className="self-start" onPress={() => router.push('/user/friends')}>
              <ButtonIcon as={UsersRound} className='w-7 h-7 text-typography-600' />
            </Button>
            <Button variant="link" className="self-start" onPress={() => router.push('/user/settings')}>
              <ButtonIcon as={SettingsIcon} className='w-7 h-7 text-typography-600' />
            </Button>
            </View>
            <ProfileCard
              profile={profile}
              isLoading={profileLoading}
              onAddFriendPress={() => router.push('/user/friends/add')}
              onFriendsPress={() => router.push('/user/friends')}
              onActivitiesPress={() => router.push('/user/previousActivities')}
              onReviewsPress={() => router.push('/user/reviews')}
            />
          </View>

          <Divider className="mb-4" />

          <UpcomingActivities
            activities={upcomingActivities}
            isLoading={upcomingLoading}
            fadeAnim={upcomingFadeAnim}
            onViewAll={() => router.push('/user/upcomingActivities')}
            onCardPress={(activityId, activityName) =>
              router.push({ pathname: '/(tabs)/activity', params: { activity: activityName, activityId } })
            }
          />

          <PreviousActivities
            activities={previousActivities}
            isLoading={previousLoading}
            fadeAnim={previousFadeAnim}
            onViewAll={() => router.push('/user/previousActivities')}
            onCardPress={(activityId, activityName) =>
              router.push({ pathname: '/(tabs)/activity', params: { activity: activityName, activityId } })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
