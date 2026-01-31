import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

interface ReviewItem {
  id: number;
  activity: string;
  location: string;
  rating: number;
  dateTime: string;
  month: string;
}

interface GroupedReviewsListProps {
  items: ReviewItem[];
  groupBy: 'month' | 'year';
  renderItem: (item: ReviewItem, isLast: boolean) => React.ReactNode;
  emptyMessage: string;
  sortOrder?: 'asc' | 'desc';
}

export function GroupedReviewsList({
  items,
  groupBy,
  renderItem,
  emptyMessage,
  sortOrder = 'desc',
}: GroupedReviewsListProps) {
  if (!items || items.length === 0) {
    return (
      <Text className="text-center text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
        {emptyMessage}
      </Text>
    );
  }

  // group items
  const groupedItems = items.reduce(
    (acc, item) => {
      const key = groupBy === 'month' ? item.month : item.month.split(' ')[1];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, ReviewItem[]>
  );

  // sort groups
  const sortedGroups = Object.keys(groupedItems).sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b).getTime() - new Date(a).getTime();
    }
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <View>
      {sortedGroups.map((group) => (
        <View key={group}>
          <Text
            className="text-typography-700 text-lg mb-3"
            style={{ fontFamily: 'Roboto-Medium' }}
          >
            {group}
          </Text>
          <View className="bg-white rounded-2xl shadow-soft-1 overflow-hidden">
            {groupedItems[group].map((item, index) =>
              renderItem(item, index === groupedItems[group].length - 1)
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
