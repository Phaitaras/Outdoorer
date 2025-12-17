import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export interface ActivityListItemProps {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  isLast: boolean;
  onPress?: () => void;
}

export function ActivityListItem({
  emoji,
  title,
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
        <View className="flex-row items-center gap-4 flex-1">
          <Text className="text-2xl">{emoji}</Text>
          <View className="flex-col flex-1">
            <Text className="text-base text-typography-900" style={{ fontFamily: 'Roboto-Medium' }}>
              {title}
            </Text>
            <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              {subtitle}
            </Text>
          </View>
        </View>
        <ChevronRightIcon className="w-5 h-5 text-typography-400 ml-2" />
      </Pressable>
      {!isLast && <Divider className="mx-5" />}
    </>
  );
}
