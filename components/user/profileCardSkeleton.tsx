import { Divider } from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

export function ProfileCardSkeleton() {
  return (
    <View className="bg-white p-6 rounded-2xl shadow-soft-1">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row gap-6 items-center">
          <Skeleton startColor="bg-background-100" speed={4} className="h-16 w-16 rounded-full" />
          <View className="flex-col gap-2">
            <Skeleton startColor="bg-background-100" speed={4} className="h-6 w-32 rounded-md" />
            <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-24 rounded-md" />
          </View>
        </View>
        <Skeleton startColor="bg-background-100" speed={4} className="h-8 w-8 mt-1 mr-1 rounded-md self-start" />
      </View>

      <View className="flex-row flex-wrap mb-6 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} startColor="bg-background-100" speed={4} className="h-8 w-20 rounded-3xl" />
        ))}
      </View>

      <View className="flex-row gap-6">
        <View className="flex-col gap-2">
          <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-12 rounded-md" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-16 rounded-md" />
        </View>
        <Divider orientation="vertical" />
        <View className="flex-col gap-2">
          <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-12 rounded-md" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-20 rounded-md" />
        </View>
        <Divider orientation="vertical" />
        <View className="flex-col gap-2">
          <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-12 rounded-md" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-16 rounded-md" />
        </View>
      </View>
    </View>
  );
}
