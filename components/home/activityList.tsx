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
