import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

interface GroupedListProps {
  items: any[];
  groupBy: string; // property name to group by
  renderItem: (item: any, isLast: boolean, onPress?: () => void) => React.ReactNode;
  emptyMessage: string;
  sortOrder?: 'asc' | 'desc';
}

export function GroupedActivityList({
  items,
  groupBy,
  renderItem,
  emptyMessage,
  sortOrder = 'desc',
}: GroupedListProps) {
  // group items
  const grouped = items.reduce((acc, item) => {
    const groupKey = item[groupBy];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // sort groups
  const groups = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  if (items.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-col gap-6">
      {groups.map((group) => (
        <View key={group}>
          <Text className="text-lg text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
            {group}
          </Text>
          <View className="bg-white rounded-2xl shadow-soft-1 overflow-hidden">
            {grouped[group].map((item: any, index: any) =>
              renderItem(item, index === grouped[group].length - 1)
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
