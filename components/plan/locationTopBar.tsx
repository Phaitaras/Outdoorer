import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import LocationSearchBar from './locationSearchBar';

interface LocationTopBarProps {
  onBackPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchFocus: () => void;
  onClearSearch: () => void;
  results: Array<{ displayLines: string[]; completionUrl: string }>;
  isLoading: boolean;
  showResults: boolean;
  onSelectResult: (result: { displayLines: string[]; completionUrl: string }) => void;
}

export default function LocationTopBar({
  onBackPress,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onClearSearch,
  results,
  isLoading,
  showResults,
  onSelectResult,
}: LocationTopBarProps) {
  return (
    <View className="absolute top-0 left-0 right-0 pt-4 px-4">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={onBackPress}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-soft-2 border border-outline-200"
        >
          <ChevronLeft size={22} color="#222222" />
        </Pressable>

        <LocationSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onFocus={onSearchFocus}
          onClear={onClearSearch}
          results={results}
          isLoading={isLoading}
          showResults={showResults}
          onSelectResult={onSelectResult}
        />
      </View>
    </View>
  );
}
