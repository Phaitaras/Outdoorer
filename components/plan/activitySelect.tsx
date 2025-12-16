import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { ACTIVITIES } from './constants';

export function ActivitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text
        className="mb-1 text-[14px] text-typography-700"
        style={{ fontFamily: 'Roboto-Medium' }}
      >
        Activity <Text className="text-error-500">*</Text>
      </Text>

      <Select selectedValue={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-lg border border-outline-200 bg-white">
          <SelectInput placeholder="Select activity" className="text-[14px]" />
          <SelectIcon as={ChevronDown} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            {ACTIVITIES.map((a) => (
              <SelectItem key={a.value} label={a.label} value={a.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
}
