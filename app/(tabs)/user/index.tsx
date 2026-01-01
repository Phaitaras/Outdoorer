import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { ProfileCard } from '@/components/user/profileCard';
import { useRouter } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function User() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View className="flex-col">

          <View className="mb-6">
            <ProfileCard
              name="Sirapop"
              title="Novice Outdoorer"
              avatarColor="blue"
              activities={['🏃‍♂️  Running', '🚴‍♀️  Cycling', '🥾  Hiking', '🧗  Rock Climbing', '🛶  Kayaking']}
              friendsCount={3}
              activitiesCount={3}
              reviewsCount={1}
              showButtons={true}
              showSettings={true}
              onSettingsPress={() => router.push('/user/settings')}
              onAddFriendPress={() => router.push('/user/addFriend')}
              onViewBookmarksPress={() => {
                // TODO: Navigate to bookmarks
              }}
              onFriendsPress={() => router.push('/user/friends')}
              onActivitiesPress={() => router.push('/user/previousActivities')}
            />
          </View>

          <Divider className="mb-4" />

          {/* upcoming plans */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-typography-800 text-lg" style={{ fontFamily: 'Roboto-Medium' }}>
              Upcoming Plans
            </Text>
            <Pressable onPress={() => router.push('/user/upcomingPlans')} className="flex-row items-center gap-2">
              <ChevronRightIcon className="w-6 h-6 text-typography-400" />
            </Pressable>
          </View>
          <ActivityCardsScroll
            cards={[
              { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 17', timeWindow: '9:00 - 11:00' },
              { id: '2', activity: 'Cycling', emoji: '🚴‍♀️', date: 'Dec 18', timeWindow: '10:00 - 12:00' },
              { id: '3', activity: 'Hiking', emoji: '🥾', date: 'Dec 19', timeWindow: '13:00 - 17:00' },
            ]}
            onCardPress={(card) => router.push({ pathname: '/(tabs)/activity', params: { activity: card.activity } })}
            emptyMessage="No upcoming plans"
          />

          {/* recent activities */}
          <View className="flex-row justify-between items-center mt-4 mb-2">
            <Text className="text-typography-800 text-lg" style={{ fontFamily: 'Roboto-Medium' }}>
              Previous Activities
            </Text>
            <Pressable onPress={() => router.push('/user/previousActivities')}>
              <ChevronRightIcon className="w-6 h-6 text-typography-400" />
            </Pressable>
          </View>
          <ActivityCardsScroll
            cards={[
              { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 15', timeWindow: '9:00 - 11:00' },
              { id: '2', activity: 'Surfing', emoji: '🏄‍♂️', date: 'Dec 12', timeWindow: '13:00 - 17:00' },
              { id: '3', activity: 'Kayaking', emoji: '🛶', date: 'Dec 11', timeWindow: '10:00 - 12:00' },
            ]}
            onCardPress={(card) => router.push({ pathname: '/(tabs)/activity', params: { activity: card.activity } })}
            emptyMessage="No recent activities"
          />
          
        </View>
      </ScrollView>
    </View>


  );
}
