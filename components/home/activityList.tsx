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
            <Text className="mt-5 mb-2 text-[18px] text-typography-800" style={{ fontFamily: 'Roboto-Bold' }}>
                Activities
            </Text>

            <View className={className ?? 'gap-3 mb-4'}>
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
