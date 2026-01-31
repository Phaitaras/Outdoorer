import { ReviewFormView } from '@/components/map/reviewFormView';
import { Text } from '@/components/ui/text';
import { useActivityById } from '@/features/activity';
import { useReviewSubmission } from '@/features/map';
import { useUserReviewDetail } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ReviewDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; activityId?: string }>();
  const reviewId = params.id ? Number(params.id) : null;
  const activityIdParam = params.activityId ? Number(params.activityId) : null;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  const { data: reviewDetail, isLoading: reviewLoading } = useUserReviewDetail(reviewId);
  const { data: activityData, isLoading: activityLoading } = useActivityById(activityIdParam);

  const isLoading = reviewLoading || activityLoading;

  // For existing review
  const existingReview = reviewDetail
    ? {
        id: reviewDetail.id,
        rating: reviewDetail.rating,
        description: reviewDetail.description,
      }
    : null;

  // For new review on activity
  const activityForSubmission = reviewDetail?.activity ?? activityData ?? null;

  const { submitReview, deleteReview, isSubmitting, isDeleting } = useReviewSubmission({
    currentActivity: activityForSubmission,
    currentUserId: userId,
    existingReview,
    onSuccess: () => router.back(),
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F6F6F7] items-center justify-center">
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  // If neither review nor activity data found
  if (!reviewDetail && !activityData) {
    return (
      <View className="flex-1 bg-[#F6F6F7] items-center justify-center">
        <Text className="text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
          Review or activity not found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F6F6F7]">
      <ReviewFormView
        locationTitle={activityForSubmission?.location?.name ?? 'Location'}
        existingReview={existingReview}
        isOwnActivity
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        fullPage={true}
        onClose={() => router.back()}
        onSubmit={submitReview}
        onDelete={deleteReview}
      />
    </View>
  );
}
