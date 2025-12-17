import React from 'react';
import { View, Text } from 'react-native';
import { ActivityCard } from './activityCard';
import type { Sentiment } from './sentiment';

export type ActivityItem = {
    emoji: string;
    title: string;
    status: Sentiment;
    next6: Sentiment[];
    windowText: string;
    onPress?: () => void;
};

export function ActivityList({ items, className }: { items: ActivityItem[]; className?: string }) {
    return (
        <View>
            <Text className="mt-6 mb-4 text-xl text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
                Activities
            </Text>

            <View className={className ?? 'gap-4 mb-4'}>
                {items.map((item, idx) => (
                    <ActivityCard
                        key={`${item.title}-${idx}`}
                        emoji={item.emoji}
                        title={item.title}
                        status={item.status}
                        next6={item.next6}
                        windowText={item.windowText}
                        onPress={item.onPress}
                    />
                ))}
            </View>
        </View>
    );
}
