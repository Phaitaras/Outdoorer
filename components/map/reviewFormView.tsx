import { StarRating } from '@/components/common/starRating';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { ChevronLeft, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

interface ReviewFormViewProps {
  locationTitle?: string | null;
  existingReview?: { id: number; rating: number; description: string } | null;
  isOwnActivity: boolean;
  isSubmitting: boolean;
  isDeleting?: boolean;
  fullPage?: boolean;
  onClose: () => void;
  onSubmit: (rating: number, description: string) => Promise<void>;
  onDelete?: () => void;
}

export function ReviewFormView({
  locationTitle,
  existingReview,
  isOwnActivity,
  isSubmitting,
  isDeleting,
  fullPage = false,
  onClose,
  onSubmit,
  onDelete,
}: ReviewFormViewProps) {
  const [userRating, setUserRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState('');

  useEffect(() => {
    if (existingReview) {
      setUserRating(existingReview.rating);
      setReviewDescription(existingReview.description || '');
    } else {
      setUserRating(0);
      setReviewDescription('');
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    if (userRating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting.');
      return;
    }

    await onSubmit(userRating, reviewDescription);
  };

  // show no review
  if (!isOwnActivity && !existingReview) {
    return (
      <View className="p-8 w-full">
        {/* header + back chevron */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Pressable onPress={onClose} className="">
              <ChevronLeft size={28} color="#666" />
            </Pressable>
            <Text size="md" style={{ fontFamily: 'Roboto-Regular' }} className="ml-2">
              Review
            </Text>
          </View>
          {!fullPage && (
            <Pressable onPress={onClose} className="p-2">
              <X size={24} color="#666" />
            </Pressable>
          )}
        </View>

        {/* no review message */}
        <Text className="text-typography-600 text-center mt-12" style={{ fontFamily: 'Roboto-Regular' }}>
          There is no review from the user.
        </Text>
      </View>
    );
  }

  return (
    <View className="p-8 w-full">
      {/* header + back chevron */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Pressable onPress={onClose} className="">
            <ChevronLeft size={28} color="#666" />
          </Pressable>
          <Text size="md" style={{ fontFamily: 'Roboto-Regular' }} className="ml-2">
            {isOwnActivity ? (existingReview ? 'Edit Review' : 'Leave Review') : 'Review'}
          </Text>
        </View>
        {!fullPage && (
          <Pressable onPress={onClose}>
            <X size={24} color="#666" />
          </Pressable>
        )}
      </View>

      {/* rating */}
      <View className="mb-3">
        <Text className="text-typography-600 mb-1" style={{ fontFamily: 'Roboto-Medium' }}>
          Rating
        </Text>
        <StarRating
          value={userRating}
          size={25}
          readonly={!isOwnActivity}
          onChange={isOwnActivity ? setUserRating : undefined}
          inactiveColor="#E5E7EB"
        />

      </View>

      {/* description */}
      <View className={fullPage ? "mb-6" : "mb-4"}>
        <Text className="text-typography-600 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
          Description
        </Text>
        {isOwnActivity ? (
          <Textarea className={fullPage ? "h-[200px] rounded-2xl" : "min-h-[100px] rounded-2xl"}>
            <TextareaInput
              placeholder=" Share your experience"
              value={reviewDescription}
              onChangeText={setReviewDescription}
              multiline
            />
          </Textarea>
        ) : (
          <Text className="text-typography-800" style={{ fontFamily: 'Roboto-Regular' }}>
            {reviewDescription || 'No description provided'}
          </Text>
        )}
      </View>

      {/* action buttons */}
      {isOwnActivity && (
        <View className={existingReview ? "flex-row gap-4 mt-2" : "mt-2"}>
          {existingReview && onDelete && (
            <Button
              variant="outline"
              size="md"
              className="rounded-full flex-1"
              onPress={onDelete}
              disabled={isSubmitting || isDeleting}
            >
              <Text style={{ fontFamily: 'Roboto-Medium' }}>
                {isDeleting ? 'Deleting...' : 'Delete Review'}
              </Text>
            </Button>
          )}
          <Button
            variant="solid"
            size="md"
            className={existingReview ? "rounded-full flex-1" : "w-full rounded-full"}
            onPress={handleSubmit}
            disabled={isSubmitting || isDeleting}
          >
            <Text style={{ fontFamily: 'Roboto-Medium', color: '#FFFFFF' }}>
              {isSubmitting ? 'Posting' : 'Leave Review'}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
