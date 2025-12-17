import { Button, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, MapPin, Search, SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export function LocationHeader({
  locationLabel,
  onFiltersPress,
  onSearchPress,
  className,
  displayArrow = false,
}: {
  locationLabel: string;
  onFiltersPress?: () => void;
  onSearchPress?: () => void;
  className?: string;
  displayArrow?: boolean;
}) {
  const router = useRouter();

  return (
    <View className={className ?? 'rounded-2xl mb-3'}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {displayArrow ? (
            <Pressable onPress={() => router.back()}>
              <ArrowLeftIcon size={18} />
            </Pressable>
          ) : (
            <MapPin size={18} />
          )}

          <Text className="text-[20px]" style={{ fontFamily: 'Roboto-Medium' }}>
            {locationLabel}
          </Text>
        </View>
        <Button variant="solid" size="xs" className="px-2 rounded-md" onPress={onFiltersPress}>
          <ButtonIcon as={SlidersHorizontal} />
        </Button>
      </View>
      <View className="mt-3">
        <Input className="rounded-xl" size="sm">
          <InputField placeholder=" Specify a destination" className="pl-2 text-sm" />
          <Button variant="link" size="sm" className="mr-2" onPress={onSearchPress}>
            <ButtonIcon as={Search} />
          </Button>
        </Input>
      </View>
    </View>
  );
}
