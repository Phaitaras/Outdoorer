import { Spinner } from '@/components/ui/spinner';
import { ActivityListItem } from '@/components/user/activityListItem';
import { GroupedActivityList } from '@/components/user/groupedActivityList';
import { UserHeader } from '@/components/user/userHeader';
import { useFadeInAnimation } from '@/features/home';
import { useUserActivities } from '@/features/profile';
import { activityToCard } from '@/features/profile/utils';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';

interface ActivityItem {
  id: string;
  activity: string;
  location?: string;
  date: string;
  month: string;
  timeWindow: string;
}

export default function UpcomingActivitiesScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const { data: activities = [], isLoading: activitiesLoading } = useUserActivities({
    userId: userId ?? '',
    type: 'upcoming',
    limit: 100,
  });

  const activitiesFadeAnim = useFadeInAnimation({
    isLoading: activitiesLoading,
    hasData: activities.length > 0,
    itemCount: activities.length,
  });

  const activityItems: ActivityItem[] = (activities || []).map((activity) => {
    const card = activityToCard(activity);
    const startTime = new Date(activity.start_time);
    const month = startTime.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return {
      id: card.id,
      activity: card.activity,
      location: activity.location?.name,
      date: card.date,
      month,
      timeWindow: card.timeWindow,
    };
  });

  const renderActivityItem = (item: ActivityItem, isLast: boolean) => (
    <ActivityListItem
      key={item.id}
      id={item.id}
      title={item.activity}
      location={item.location}
      subtitle={`${item.date} • ${item.timeWindow}`}
      isLast={isLast}
      onPress={() => {
        router.push({ 
          pathname: '/(tabs)/activity', 
          params: { 
            activity: item.activity,
            activityId: item.id,
          } 
        });
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Upcoming Plans" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {activitiesLoading ? (
            <View className="items-center justify-center py-12">
              <Spinner size="large" />
            </View>
          ) : (
            <Animated.View style={{ opacity: activitiesFadeAnim }}>
              <GroupedActivityList
                items={activityItems}
                groupBy="month"
                renderItem={renderActivityItem}
                emptyMessage="No upcoming plans"
                sortOrder="asc"
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
