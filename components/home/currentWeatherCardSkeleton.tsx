import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

export function CurrentWeatherCardSkeleton() {
  return (
    <View>
      <View className="bg-white rounded-2xl p-4 px-6 shadow-soft-1">
        <View className="flex-row items-center mb-1">
          <View className="flex-row items-center gap-3 flex-1">
            <Skeleton startColor="bg-background-100" speed={4} className="h-11 w-11 rounded-full" />
            <View>
              <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-16 mb-2 rounded-md" />
              <Skeleton startColor="bg-background-100" speed={4} className="h-6 w-20 rounded-md" />
            </View>
          </View>
          <Skeleton startColor="bg-background-100" speed={4} className="h-11 w-20 rounded-xl" />
        </View>

        <View className="flex-row items-center gap-4 mt-4 justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} className="items-center">
              <Skeleton startColor="bg-background-100" speed={4} className="h-3 w-6 mb-1.5 rounded-md" />
              <Skeleton startColor="bg-background-100" speed={4} className="h-[22px] w-[22px] rounded-md mb-1.5" />
              <Skeleton startColor="bg-background-100" speed={4} className="h-3 w-6 rounded-md" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
