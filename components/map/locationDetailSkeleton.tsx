import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

export function LocationDetailSkeleton() {
  return (
    <View className="p-8 w-full">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row gap-4 items-center">
          <Skeleton startColor="bg-background-100" speed={4} className="h-12 w-12 rounded-full" />
          <View className="flex-col gap-1">
            <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-24 rounded-md" />
            <Skeleton startColor="bg-background-100" speed={4} className="h-3 w-20 rounded-md" />
          </View>
        </View>
        <Skeleton startColor="bg-background-100" speed={4} className="h-8 w-8 rounded-md" />
      </View>

      <Skeleton startColor="bg-background-100" speed={4} className="h-7 w-48 mb-3 rounded-md" />

      <View className="flex-row gap-2 mb-4 items-center">
        <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-8 rounded-md" />
        <View className="flex-row gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} startColor="bg-background-100" speed={4} className="h-5 w-5 rounded-full" />
          ))}
        </View>
      </View>

      <View className="flex-row gap-6 mb-16">
        <View className="flex-col gap-2">
          <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-10 rounded-md" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-24 rounded-md" />
        </View>
        <View className="flex-col gap-2">
          <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-10 rounded-md" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-28 rounded-md" />
        </View>
      </View>

      <View className="flex-row justify-center gap-4 mt-1">
        <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-36 rounded-full" />
        <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-32 rounded-full" />
      </View>
    </View>
  );
}
