import { ActivityListItem } from '@/components/user/activityListItem';
import { GroupedActivityList } from '@/components/user/groupedActivityList';
import { UserHeader } from '@/components/user/userHeader';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

interface Plan {
  id: string;
  activity: string;
  emoji: string;
  date: string;
  month: string;
  timeWindow: string;
}

export default function UpcomingPlansScreen() {
  const router = useRouter();
  const plans: Plan[] = [
    { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 17', month: 'December 2025', timeWindow: '9:00 - 11:00' },
    { id: '2', activity: 'Cycling', emoji: '🚴‍♀️', date: 'Dec 18', month: 'December 2025', timeWindow: '10:00 - 12:00' },
    { id: '3', activity: 'Hiking', emoji: '🥾', date: 'Dec 19', month: 'December 2025', timeWindow: '13:00 - 17:00' },
    { id: '4', activity: 'Rock Climbing', emoji: '🧗', date: 'Jan 8', month: 'January 2026', timeWindow: '14:00 - 16:00' },
    { id: '5', activity: 'Kayaking', emoji: '🛶', date: 'Jan 15', month: 'January 2026', timeWindow: '10:00 - 13:00' },
  ];

  const renderPlanItem = (plan: Plan, isLast: boolean) => (
    <ActivityListItem
      key={plan.id}
      id={plan.id}
      title={plan.activity}
      subtitle={`${plan.date} • ${plan.timeWindow}`}
      isLast={isLast}
      onPress={() => {
        router.push({ pathname: '/(tabs)/activity', params: { activity: plan.activity } });
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Upcoming Plans" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <GroupedActivityList
            items={plans}
            groupBy="month"
            renderItem={renderPlanItem}
            emptyMessage="No upcoming plans"
            sortOrder="asc"
          />
        </View>
      </ScrollView>
    </View>
  );
}
