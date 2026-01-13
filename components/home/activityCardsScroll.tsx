import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export type ActivityCard = {
  id: string;
  activity: string;
  emoji: string;
  date: string;
  timeWindow: string;
};

export function ActivityCardsScroll({ 
  cards, 
  onCardPress, 
  emptyMessage = 'No activities' 
}: { 
  cards: ActivityCard[]; 
  onCardPress?: (card: ActivityCard) => void;
  emptyMessage?: string;
}) {
  const handlePress = (card: ActivityCard) => {
    // TODO: Add redirect navigation logic
    onCardPress?.(card);
  };

  if (cards.length === 0) {
    return (
      <View className="py-6">
        <Text className="text-typography-500 text-md" style={{ fontFamily: 'Roboto-Regular' }}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="relative">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
        className="gap-3"
      >
        <View className="flex-row gap-3">
          {cards.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => handlePress(card)}
              className=" bg-white rounded-2xl p-4 px-6 border border-outline-100"
            >
              <View className="flex-col">
                <Text className="text-lg mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
                  {card.emoji ? `${card.emoji} ${card.activity}` : card.activity}
                </Text>

                <Text className="text-sm" style={{ fontFamily: 'Roboto-Regular' }}>
                  {card.timeWindow}
                </Text>

                <Text className="text-sm" style={{ fontFamily: 'Roboto-Regular' }}>
                  {card.date}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      
      <LinearGradient
        colors={['rgba(246, 246, 247, 0)', 'rgba(246, 246, 247, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 20,
        }}
        pointerEvents="none"
      />
    </View>
  );
}
