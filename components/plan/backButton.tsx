import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-soft-2 border border-outline-200"
    >
      <ChevronLeft size={22} color="#222222" />
    </Pressable>
  );
}
