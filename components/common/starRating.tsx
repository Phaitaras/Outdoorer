import { Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  readonly?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  onChange?: (value: number) => void;
}

export function StarRating({
  value,
  max = 5,
  size = 20,
  readonly = false,
  activeColor = '#FBBF24',
  inactiveColor = '#E5E7EB',
  onChange,
}: StarRatingProps) {
  const roundedValue = Math.round(value);

  return (
    <View className="flex-row gap-[2px]" accessibilityRole="adjustable">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= roundedValue;

        return (
          <Pressable
            key={starValue}
            onPress={() => {
              if (!readonly && onChange) {
                onChange(starValue);
              }
            }}
            disabled={readonly}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              color={isFilled ? activeColor : inactiveColor}
              fill={isFilled ? activeColor : inactiveColor}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
