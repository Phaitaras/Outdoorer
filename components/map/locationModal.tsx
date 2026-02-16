import { LocationModalLocation, useLocationModalAnimation, useLocationModalData, useReviewSubmission } from '@/features/map';
import { useProfile } from '@/features/profile';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { LocationDetailSkeleton } from './locationDetailSkeleton';
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
  const {
    slideAnim,
    horizontalSlideAnim,
    backgroundOpacity,
    isVisible,
    currentLocation,
    handleOpenReviewForm,
    handleCloseReviewForm,
  } = useLocationModalAnimation({ location });

  const { currentActivity, review, isOwnActivity, activityLabel, refetchReview } = useLocationModalData({
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

  if (profileLoading) {
    return (
      <View className="flex-column absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-[2rem] overflow-hidden">
        <LocationDetailSkeleton />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
      className="absolute bottom-0 left-0 right-0"
      style={{ backgroundColor: 'transparent' }}
    >
      <Animated.View 
        className="absolute top-0 bottom-0 left-0 right-0 rounded-t-[2rem] bg-white"
        style={{ opacity: backgroundOpacity }}
        pointerEvents="none"
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View 
          className="flex-column bg-white shadow-lg rounded-t-[2rem] overflow-hidden"
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
            onSeeReview={handleOpenReviewForm}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

