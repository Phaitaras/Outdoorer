import { Button, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SearchBar({
  value,
  placeholder = 'Search',
  onChangeText,
  onSearch,
  size = 'md',
  className,
}: SearchBarProps) {
  return (
    <View className={className}>
      <Input className="rounded-xl" size={size}>
        <InputField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="pl-3 text-sm"
          style={{ fontFamily: 'Roboto-Regular' }}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <Button variant="link" size={size} className="mr-2" onPress={onSearch}>
          <ButtonIcon as={Search} />
        </Button>
      </Input>
    </View>
  );
}
