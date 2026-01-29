import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function ToggleButton({ label, active, onPress }: ToggleButtonProps) {
  return (
    <Button
      onPress={onPress}
      className="rounded-full shadow-soft-2"
      size="md"
      action={active ? 'primary' : 'secondary'}
      variant='outline'
    >
      <ButtonText style={{ fontFamily: 'Roboto-Regular' }}>{label}</ButtonText>
    </Button>
  );
}
