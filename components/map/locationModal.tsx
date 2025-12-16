import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export function LocationModal({
  location,
  onPlanActivity,
  onSeeReview,
  onLeaveReview,
}: {
  location: { id: string; latitude: string; longitude: string } | null;
  onPlanActivity?: () => void;
  onSeeReview?: () => void;
  onLeaveReview?: () => void;
}) {
  if (!location) return null;

  return (
    <View className="flex-column absolute bottom-0 left-0 right-0 bg-white p-8 shadow-lg rounded-t-3xl">
      <Text size="xl" style={{ fontFamily: 'Roboto-Medium' }} className="color-typography-800">
        Placeholder Location {location.id}
      </Text>
      <Text size="lg" style={{ fontFamily: 'Roboto-Medium' }} className="color-typography-800">
        Rating
      </Text>
      <Text size="sm" style={{ fontFamily: 'Roboto-Regular' }} className="color-typography-800 mt-1">
        Place Description
      </Text>
      <View className="flex-row justify-between mt-6">
        <Button variant="solid" size="sm" className="px-4 rounded-full" onPress={onPlanActivity}>
          <Text style={{ fontFamily: 'Roboto-Medium', color: '#FFFFFF' }}>Plan Activity</Text>
        </Button>
        <Button variant="outline" size="sm" className="px-4 rounded-full" onPress={onSeeReview}>
          <Text style={{ fontFamily: 'Roboto-Medium' }}>See Review</Text>
        </Button>
        <Button variant="outline" size="sm" className="px-4 rounded-full" onPress={onLeaveReview}>
          <Text style={{ fontFamily: 'Roboto-Medium' }}>Leave Review</Text>
        </Button>
      </View>
    </View>
  );
}
