import { ActivityListItem } from '@/components/user/activityListItem';
import { GroupedActivityList } from '@/components/user/groupedActivityList';
import { UserHeader } from '@/components/user/userHeader';
import React from 'react';
import { ScrollView, View } from 'react-native';

interface Activity {
  id: string;
  activity: string;
  emoji: string;
  date: string;
  month: string;
  timeWindow: string;
}

export default function PreviousActivitiesScreen() {
  const activities: Activity[] = [
    { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 15', month: 'December 2025', timeWindow: '9:00 - 11:00' },
    { id: '2', activity: 'Surfing', emoji: '🏄‍♂️', date: 'Dec 12', month: 'December 2025', timeWindow: '13:00 - 17:00' },
    { id: '3', activity: 'Kayaking', emoji: '🛶', date: 'Dec 11', month: 'December 2025', timeWindow: '10:00 - 12:00' },
    { id: '4', activity: 'Hiking', emoji: '🥾', date: 'Nov 28', month: 'November 2025', timeWindow: '08:00 - 14:00' },
    { id: '5', activity: 'Cycling', emoji: '🚴‍♀️', date: 'Nov 20', month: 'November 2025', timeWindow: '15:00 - 17:00' },
  ];

  const renderActivityItem = (activity: Activity, isLast: boolean) => (
    <ActivityListItem
      key={activity.id}
      id={activity.id}
      emoji={activity.emoji}
      title={activity.activity}
      subtitle={`${activity.date} • ${activity.timeWindow}`}
      isLast={isLast}
      onPress={() => {
        // TODO: Navigate to activity details
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Previous Activities" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <GroupedActivityList
            items={activities}
            groupBy="month"
            renderItem={renderActivityItem}
            emptyMessage="No previous activities"
            sortOrder="desc"
          />
        </View>
      </ScrollView>
    </View>
  );
}
