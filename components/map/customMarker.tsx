import { ACTIVITY_TYPE_TO_EMOJI, DEFAULT_ACTIVITY_EMOJI } from '@/constants/mapMarkers';
import React from 'react';
import { Text } from 'react-native';

interface CustomMarkerProps {
  emoji: string;
}

export const getActivityEmoji = (activity: string): string => {
  return ACTIVITY_TYPE_TO_EMOJI[activity] || DEFAULT_ACTIVITY_EMOJI;
};

export function CustomMarker({ emoji }: CustomMarkerProps) {
  return (
    <Text
      style={{
        fontSize: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      }}
    >
      {emoji}
    </Text>
  );
}
