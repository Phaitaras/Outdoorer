import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { AVATAR_COLOR_HEX } from '@/constants/user';
import { getAvatarColor, LocationModalLocation, useLocationModalAnimation, useLocationModalData, useReviewSubmission } from '@/features/map';
import { useProfile } from '@/features/profile';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';
import { LocationDetailView } from './locationDetailView';
import { ReviewFormView } from './reviewFormView';

export function LocationModal({
  location,
  currentUserId,
  onPlanActivity,
  onSeeReview,
  onClose,
}: {
  location: LocationModalLocation | null;
  currentUserId: string | null;
  onPlanActivity?: () => void;
  onSeeReview?: () => void;
  onClose?: () => void;
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const {
    slideAnim,
    horizontalSlideAnim,
    isVisible,
    currentLocation,
    openReviewForm,
    closeReviewForm,
  } = useLocationModalAnimation({ location });

  const { currentActivity, review, isOwnActivity, refetchReview } = useLocationModalData({
    currentLocation,
    currentUserId,
  });

  useFocusEffect(
    useCallback(() => {
      if (isVisible && currentActivity?.id) {
        refetchReview();
      }
    }, [isVisible, currentActivity?.id, refetchReview])
  );

  const { data: userProfile, isLoading: profileLoading } = useProfile(
    currentActivity?.user_id ?? null
  );

  const activityLabel = useMemo(() => {
    if (!currentActivity?.activity_type) return null;
    return LABEL_TO_ACTIVITY[currentActivity.activity_type];
  }, [currentActivity?.activity_type]);

  const handleOpenReviewForm = () => {
    setShowReviewForm(true);
    openReviewForm();
  };

  const handleSeeReview = () => {
    setShowReviewForm(true);
    openReviewForm();
  };

  const handleCloseReviewForm = () => {
    closeReviewForm();
    setTimeout(() => setShowReviewForm(false), 300);
  };

  const handleReviewSuccess = () => {
    handleCloseReviewForm();
    if (onClose) onClose();
  };

  const { submitReview, deleteReview, isSubmitting, isDeleting } = useReviewSubmission({
    currentActivity,
    currentUserId,
    existingReview: review,
    onSuccess: handleReviewSuccess,
  });

  if (!isVisible && !currentLocation) return null;

  const avatarColor = getAvatarColor(currentActivity?.user_id);
  const color = AVATAR_COLOR_HEX[avatarColor] || AVATAR_COLOR_HEX['blue'];

  if (profileLoading) {
    return (
      <View className="flex-column absolute bottom-0 left-0 right-0 bg-white p-10 shadow-lg rounded-t-[2rem] items-center justify-center py-12">
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  return (
    <Animated.View 
      className="flex-column absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-[2rem] overflow-hidden"
      style={{ transform: [{ translateY: slideAnim }] }}
    >
      <Animated.View
        className="flex-row"
        style={{ transform: [{ translateX: horizontalSlideAnim }] }}
      >
        <LocationDetailView
          locationTitle={currentLocation?.title}
          userProfile={userProfile}
          currentActivity={currentActivity}
          review={review}
          isOwnActivity={isOwnActivity}
          activityLabel={activityLabel}
          onClose={onClose}
          onPlanActivity={onPlanActivity}
          onOpenReviewForm={handleOpenReviewForm}
          onSeeReview={handleSeeReview}
        />

        <ReviewFormView
          locationTitle={currentLocation?.title}
          existingReview={review}
          isOwnActivity={isOwnActivity}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          onClose={handleCloseReviewForm}
          onSubmit={submitReview}
          onDelete={deleteReview}
        />
      </Animated.View>
    </Animated.View>
  );
}

