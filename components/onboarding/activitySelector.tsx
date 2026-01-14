import { Button, ButtonText } from '@/components/ui/button';
import { ACTIVITIES } from '@/constants/activities';
import React from 'react';
import { View } from 'react-native';

interface ActivitySelectorProps {
  selected: string[];
  onToggle: (label: string) => void;
}

export function ActivitySelector({ selected, onToggle }: ActivitySelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {ACTIVITIES.map((label) => {
        const isActive = selected.includes(label);
        return (
          <Button
            key={label}
            variant={'outline'}
            size="sm"
            className={'rounded-3xl'}
            action={isActive ? 'primary' : 'secondary'}
            onPress={() => onToggle(label)}
          >
            <ButtonText style={{ fontFamily: 'Roboto-Regular' }}>{label}</ButtonText>
          </Button>
        );
      })}
    </View>
  );
}
