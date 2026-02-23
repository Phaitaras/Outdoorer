import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { ProfileCard } from '@/components/user/profileCard';
import { UserHeader } from '@/components/user/userHeader';
import { useFriendActions, useFriendActivities, useFriendStatus } from '@/features/friends';
import { useFadeInAnimation } from '@/features/home';
import { useProfile } from '@/features/profile';
import { activityToCard } from '@/features/profile/utils/activityToCard';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';

export default function FriendProfileScreen() {
  const params = useLocalSearchParams();
  const friendId = (params.id as string) || null;
  const friendColor = (params.color as string) || 'blue';

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setCurrentUserId(data.user.id);
    })();
  }, []);

  useFocusEffect(() => {
    refetchProfile();
    refetchStatus();
  });

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile(friendId);
  const { data: status, refetch: refetchStatus } = useFriendStatus(currentUserId, friendId);
  const { request, cancel, accept, unfriend } = useFriendActions(currentUserId, friendId);

  const isFriend = status?.status === 'accepted';
  const isPending = status?.status === 'pending';
  const isUserSide = status?.requesterId === currentUserId;
  const isOwner = !!currentUserId && !!friendId && currentUserId === friendId;
  const isActing = request.isPending || cancel.isPending || accept.isPending || unfriend.isPending;

  const actionButton = useMemo(() => {
    if (!friendId || !currentUserId || isOwner) return null;

    if (isFriend) {
      return { label: 'Unfriend', variant: 'outline', onPress: () => unfriend.mutate() };
    }

    if (isPending) {
      return isUserSide
        ? { label: 'Cancel Request', variant: 'outline', onPress: () => cancel.mutate() }
        : { label: 'Accept Request', variant: 'solid', onPress: () => accept.mutate() };
    }

    return { label: 'Request Friend', variant: 'solid', onPress: () => request.mutate() };
  }, [accept, cancel, unfriend, friendId, currentUserId, isOwner, isFriend, isPending, isUserSide, request, status?.status]);

  const activityVisibility = profile?.activity_visibility ?? 'friends';
  const canViewActivities = !!friendId && (isOwner || (activityVisibility === 'friends' && isFriend));
  const activitiesMessage = canViewActivities
    ? null
    : activityVisibility === 'private'
      ? 'Their activities are private.'
      : 'Activities are visible to friends only.';

  const { data: activities = [], isLoading: activitiesLoading } = useFriendActivities(friendId, canViewActivities, 5);

  const activityCards = useMemo(() => activities.map(activityToCard), [activities]);

  const activitiesFadeAnim = useFadeInAnimation({
    isLoading: activitiesLoading,
    hasData: activities.length > 0,
    itemCount: activities.length,
  });

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="Profile" />

      <ScrollView className="flex-1 p-8" showsVerticalScrollIndicator={false}>
        <View className="flex-col">
          <View className="mb-6">
            <ProfileCard
              profile={profile}
              isLoading={profileLoading}
              avatarColor={friendColor as any}
              onAddFriendPress={actionButton?.onPress}
              addFriendLabel={actionButton?.label}
              addFriendVariant={actionButton?.variant as any}
              addFriendDisabled={isActing}
              hideActivitiesCount={(!isFriend && activityVisibility === 'friends') || activityVisibility === 'private'}
            />
          </View>

          <Divider className="mb-4" />

          <Text className="text-typography-800 text-lg mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
            Recent Activities
          </Text>

          {!canViewActivities && (
            <Text className="text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>
              {activitiesMessage}
            </Text>
          )}

          {canViewActivities && (
            <>
              {activitiesLoading ? (
                <View className="items-center justify-center py-12">
                  <Spinner size="large" />
                </View>
              ) : (
                <Animated.View style={{ opacity: activitiesFadeAnim }}>
                  <ActivityCardsScroll
                    cards={activityCards}
                    onCardPress={() => {}}
                    emptyMessage="No recent activities"
                  />
                </Animated.View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
