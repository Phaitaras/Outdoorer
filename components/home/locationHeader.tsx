import { Button, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, MapPin, SlidersHorizontal } from 'lucide-react-native';
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
    <View className={className ?? 'rounded-2xl mb-5'}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2 flex-1">
          {displayArrow ? (
            <Pressable onPress={() => router.back()}>
              <ArrowLeftIcon size={18} />
            </Pressable>
          ) : (
            <MapPin size={18} />
          )}

          <Text 
            className="text-[20px] flex-1" 
            style={{ fontFamily: 'Roboto-Medium' }}
            numberOfLines={2}
          >
            {locationLabel}
          </Text>
        </View>
        {onFiltersPress && (
          <Button variant="solid" size="xs" className="px-2 rounded-md" onPress={onFiltersPress}>
            <ButtonIcon as={SlidersHorizontal} />
          </Button>
        )}
      </View>
    </View>
  );
}
