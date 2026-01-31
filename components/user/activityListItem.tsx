import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export interface ActivityListItemProps {
  id: string;
  title: string;
  location?: string;
  subtitle: string;
  isLast: boolean;
  onPress?: () => void;
}

export function ActivityListItem({
  title,
  location,
  subtitle,
  isLast,
  onPress,
}: ActivityListItemProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between p-5 active:bg-background-50"
      >
        <View className="flex-col">
          <Text className="text-base text-typography-900 mb-1" style={{ fontFamily: 'Roboto-Medium' }}>
            {title}
          </Text>
          {location && (
            <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              {location}
            </Text>
          )}
          <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
            {subtitle}
          </Text>
        </View>
        <ChevronRightIcon className="w-5 h-5 text-typography-400 ml-2" />
      </Pressable>
      {!isLast && <Divider className="" />}
    </>
  );
}
