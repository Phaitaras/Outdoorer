import React from 'react';
import { Text, View } from 'react-native';
import { ActivityCard } from './activityCard';
import type { Sentiment } from './sentiment';

export type ActivityItem = {
    title: string;
    status: Sentiment;
    next6: Sentiment[];
    windowText: string;
    isContentLoading?: boolean;
    onPress?: () => void;
};

export function ActivityList({ items, className, isContentLoading }: { items: ActivityItem[]; className?: string; isContentLoading?: boolean }) {
    if (items.length === 0) {
        return (
            <View className="items-center justify-center py-12 gap-2">
                <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
                    No preferred activities.
                </Text>
                <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
                    Head to Profile Settings to add activities to your feed.
                </Text>
            </View>
        );
    }
    return (
        <View className={className ?? 'gap-4 mb-4'}>
            {items.map((item, idx) => (
                <ActivityCard
                    key={`${item.title}-${idx}`}
                    title={item.title}
                    status={item.status}
                    next6={item.next6}
                    windowText={item.windowText}
                    onPress={item.onPress}
                    isContentLoading={isContentLoading}
                />
            ))}
        </View>
    );
}
