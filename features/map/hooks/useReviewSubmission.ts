import { useCreateReview, useDeleteReview, useUpdateReview } from '@/features/map';
import { Alert } from 'react-native';

interface UseReviewSubmissionProps {
  currentActivity: any;
  currentUserId: string | null;
  existingReview: { id: number; rating: number; description: string } | null;
  onSuccess: () => void;
}

export function useReviewSubmission({
  currentActivity,
  currentUserId,
  existingReview,
  onSuccess,
}: UseReviewSubmissionProps) {
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;
  const isDeleting = deleteReviewMutation.isPending;

  const submitReview = async (rating: number, description: string) => {
    if (!currentActivity?.id || !currentUserId) {
      Alert.alert('Error', 'Unable to submit review.');
      return;
    }

    try {
      if (existingReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: existingReview.id,
          rating,
          description,
        });
        Alert.alert('Success', 'Review updated successfully!');
      } else {
        await createReviewMutation.mutateAsync({
          activityId: currentActivity.id,
          userId: currentUserId,
          rating,
          description,
        });
        Alert.alert('Success', 'Review posted successfully!');
      }
      onSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    }
  };

  const deleteReview = async () => {
    if (!existingReview) {
      Alert.alert('Error', 'No review to delete.');
      return;
    }

    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReviewMutation.mutateAsync(existingReview.id);
              Alert.alert('Success', 'Review deleted successfully!');
              onSuccess();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete review. Please try again.');
              console.error('Review deletion error:', error);
            }
          },
        },
      ]
    );
  };

  return {
    submitReview,
    deleteReview,
    isSubmitting,
    isDeleting,
  };
}
