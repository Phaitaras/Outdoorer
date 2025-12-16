import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { MapPin, Search } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export function LocationInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text
        className="mb-1 text-[14px] text-typography-700"
        style={{ fontFamily: 'Roboto-Medium' }}
      >
        Location <Text className="text-error-500">*</Text>
      </Text>

      <Input className="rounded-lg bg-white">
        <InputSlot className="pl-2">
          <InputIcon as={MapPin} />
        </InputSlot>
        <InputField
          value={value}
          onChangeText={onChange}
          placeholder="Search a location"
          className="text-[14px]"
        />
        <InputSlot className="pr-2">
          <InputIcon as={Search} />
        </InputSlot>
      </Input>

      <Text
        className="mt-1 text-[11px] text-typography-500"
        style={{ fontFamily: 'Roboto-Light' }}
      >
        Defaulting to current location
      </Text>
    </View>
  );
}
