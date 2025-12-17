import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { ProfileCard } from '@/components/user/profileCard';
import { UserHeader } from '@/components/user/userHeader';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function FriendProfileScreen() {
  const params = useLocalSearchParams();
  
  const friendName = params.name as string || 'Friend';
  const friendTitle = params.title as string || 'Outdoor Enthusiast';
  const friendColor = (params.color as string) || 'blue';

  // Mock friend data
  const friendData = {
    name: friendName,
    title: friendTitle,
    avatarColor: friendColor as 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'cyan',
    activities: ['🏃‍♂️  Running', '🥾  Hiking', '🧗  Rock Climbing'],
    friendsCount: 12,
    activitiesCount: 28,
    reviewsCount: 5,
  };

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Profile" />

      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col">
          <View className="mb-6">
            <ProfileCard
              name={friendData.name}
              title={friendData.title}
              avatarColor={friendData.avatarColor}
              activities={friendData.activities}
              friendsCount={friendData.friendsCount}
              activitiesCount={friendData.activitiesCount}
              reviewsCount={friendData.reviewsCount}
              showButtons={false}
              showSettings={false}
            />
          </View>

          <Divider className="mb-4" />

          {/* Recent Activities */}
          <Text className="text-typography-800 text-lg mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
            Recent Activities
          </Text>
          <ActivityCardsScroll
            cards={[
              { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 15', timeWindow: '9:00 - 11:00' },
              { id: '2', activity: 'Hiking', emoji: '🥾', date: 'Dec 12', timeWindow: '13:00 - 17:00' },
              { id: '3', activity: 'Rock Climbing', emoji: '🧗', date: 'Dec 10', timeWindow: '10:00 - 12:00' },
            ]}
            onCardPress={() => {}}
            emptyMessage="No recent activities"
          />
        </View>
      </ScrollView>
    </View>
  );
}
