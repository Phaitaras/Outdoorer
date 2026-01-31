import { GroupedReviewsList } from '@/components/user/groupedReviewsList';
import { ReviewListItem } from '@/components/user/reviewListItem';
import { UserHeader } from '@/components/user/userHeader';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useUserReviews } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { formatActivityDate, formatActivityTime } from '@/utils/activity';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

interface ReviewItem {
  id: number;
  activity: string;
  location: string;
  rating: number;
  dateTime: string;
  month: string;
}

export default function UserReviewsScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const { data: reviews = [] } = useUserReviews(userId, 200);

  const reviewItems: ReviewItem[] = (reviews || []).map((review) => {
    const createdDate = new Date(review.created_at);
    const month = createdDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const date = formatActivityDate(review.created_at);
    const timeWindow = formatActivityTime(review.start_time, review.end_time);
    const activityDisplay = LABEL_TO_ACTIVITY[review.activity_type] || review.activity_type;

    return {
      id: review.id,
      activity: activityDisplay,
      location: review.location.name,
      rating: review.rating,
      dateTime: `${date} • ${timeWindow}`,
      month,
    };
  });

  const renderReviewItem = (item: ReviewItem, isLast: boolean) => (
    <ReviewListItem
      key={item.id}
      id={item.id}
      activityName={item.activity}
      locationName={item.location}
      rating={item.rating}
      dateTime={item.dateTime}
      isLast={isLast}
      onPress={() => {
        router.push({ pathname: '/user/reviewDetail', params: { id: item.id.toString() } });
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <UserHeader title="My Reviews" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <GroupedReviewsList
            items={reviewItems}
            groupBy="month"
            renderItem={renderReviewItem}
            emptyMessage="No reviews yet"
            sortOrder="desc"
          />
        </View>
      </ScrollView>
    </View>
  );
}
