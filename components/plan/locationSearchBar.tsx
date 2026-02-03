import { CloseIcon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

interface LocationSearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFocus: () => void;
  onClear: () => void;
  results: Array<{ displayLines: string[]; completionUrl: string }>;
  isLoading: boolean;
  showResults: boolean;
  onSelectResult: (result: { displayLines: string[]; completionUrl: string }) => void;
}

export default function LocationSearchBar({
  searchQuery,
  onSearchChange,
  onFocus,
  onClear,
  results,
  isLoading,
  showResults,
  onSelectResult,
}: LocationSearchBarProps) {
  return (
    <View className="absolute top-0 left-[12%] right-[12%] pt-4 px-4 flex-1">
      <View>
        {/* search input */}
        <Input
          variant="rounded"
          className="bg-white rounded-full shadow-soft-2 h-10"
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            placeholder="Search location"
            value={searchQuery}
            onChangeText={(text) => {
              onSearchChange(text);
            }}
            onFocus={onFocus}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <InputSlot className="pr-3">
              <Pressable
                onPress={() => {
                  onClear();
                }}
              >
                <InputIcon as={CloseIcon} />
              </Pressable>
            </InputSlot>
          )}
        </Input>
      </View>

      {/* search dropdown */}
      {showResults && (searchQuery.length >= 2 || results.length > 0) && (
        <View className="mt-2 bg-white rounded-2xl shadow-soft-1 max-h-64">
          {isLoading ? (
            <View className="p-4 items-center">
              <ActivityIndicator size="small" color="#FFAE00" />
            </View>
          ) : results.length > 0 ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              scrollEnabled={results.length > 4}
            >
              {results.map((result, index) => (
                <Pressable
                  key={`${result.completionUrl}-${index}`}
                  onPress={() => onSelectResult(result)}
                  className="px-4 py-3 border-b border-outline-100 active:bg-background-50"
                >
                  <Text
                    className="text-typography-900 text-sm"
                    style={{ fontFamily: 'Roboto-Medium' }}
                    numberOfLines={1}
                  >
                    {result.displayLines[0]}
                  </Text>
                  {result.displayLines[1] && (
                    <Text
                      className="text-typography-500 text-xs mt-0.5"
                      style={{ fontFamily: 'Roboto-Regular' }}
                      numberOfLines={1}
                    >
                      {result.displayLines[1]}
                    </Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          ) : searchQuery.length >= 2 ? (
            <View className="p-4">
              <Text className="text-typography-500 text-center text-sm">
                No results found
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
