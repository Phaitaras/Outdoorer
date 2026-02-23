import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeftIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

interface ActivityDetailSkeletonProps {
  onBack: () => void;
}

export function ActivityDetailSkeleton({ onBack }: ActivityDetailSkeletonProps) {
  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[10%]">
      <ScrollView className="flex-1 px-8 mt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6 flex-row gap-4 items-center">
          <Pressable onPress={onBack}>
            <ArrowLeftIcon size={18} />
          </Pressable>
          <Skeleton startColor="bg-background-100" speed={4} className="h-8 w-52 rounded-md" />
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Skeleton startColor="bg-background-100" speed={4} className="h-8 w-40 rounded-lg" />
          <Skeleton startColor="bg-background-100" speed={4} className="h-10 w-28 rounded-full" />
        </View>

        <View className="mt-1 mb-4">
          <Skeleton startColor="bg-background-100" speed={4} className="h-52 w-full rounded-xl" />
        </View>

        <View className="self-end mb-5">
          <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-24 rounded-md" />
        </View>

        <Skeleton startColor="bg-background-100" speed={4} className="h-4 w-32 mb-2 rounded-md" />

        <View className="bg-white rounded-2xl px-4 py-3 shadow-soft-1 border border-outline-100 mb-4">
          <View className="flex-row items-center justify-between">
            <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-36 rounded-md" />
            <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-20 rounded-md" />
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-soft-1 px-4 py-3">
          <View className="flex-row items-center justify-between pb-3">
            <View className="flex-row items-center gap-2">
              <Skeleton startColor="bg-background-100" speed={4} className="h-6 w-14 rounded-lg" />
              <Skeleton startColor="bg-background-100" speed={4} className="h-5 w-10 rounded-lg" />
            </View>
            <Skeleton startColor="bg-background-100" speed={4} className="h-6 w-14 rounded-lg" />
          </View>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} className="flex-row justify-evenly py-1 border-b border-outline-100 last:border-b-0">
              <Skeleton startColor="bg-background-100" speed={4} className="w-[48%] p-2 mr-2 h-12 rounded-lg" />
              <Skeleton startColor="bg-background-100" speed={4} className="w-[48%] p-2 h-12 rounded-lg" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
