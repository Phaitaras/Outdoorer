import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

interface UserHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export function UserHeader({ title, onBackPress }: UserHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="bg-white px-6 py-4 border-b border-outline-100">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
        </Pressable>
        <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
          {title}
        </Text>
        <View className="w-10" />
      </View>
    </View>
  );
}
