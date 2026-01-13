import { ActivityListItem } from '@/components/user/activityListItem';
import { GroupedActivityList } from '@/components/user/groupedActivityList';
import { UserHeader } from '@/components/user/userHeader';
import { useUserActivities } from '@/features/profile';
import { activityToCard } from '@/features/profile/utils';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

interface ActivityItem {
  id: string;
  activity: string;
  emoji: string;
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

  const { data: activities = [] } = useUserActivities({
    userId: userId ?? '',
    type: 'upcoming',
    limit: 100,
  });

  const activityItems: ActivityItem[] = (activities || []).map((activity) => {
    const card = activityToCard(activity);
    const startTime = new Date(activity.start_time);
    const month = startTime.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return {
      id: card.id,
      activity: card.activity,
      emoji: card.emoji,
      date: card.date,
      month,
      timeWindow: card.timeWindow,
    };
  });

  const renderActivityItem = (item: ActivityItem, isLast: boolean) => (
    <ActivityListItem
      key={item.id}
      id={item.id}
      emoji={item.emoji}
      title={item.activity}
      subtitle={`${item.date} • ${item.timeWindow}`}
      isLast={isLast}
      onPress={() => {
        router.push({ pathname: '/(tabs)/activity', params: { activity: item.activity } });
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Upcoming Activities" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <GroupedActivityList
            items={activityItems}
            groupBy="month"
            renderItem={renderActivityItem}
            emptyMessage="No upcoming activities"
            sortOrder="asc"
          />
        </View>
      </ScrollView>
    </View>
  );
}
