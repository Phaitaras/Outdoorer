import {
  Angry,
  Frown,
  Laugh,
  Meh,
  Smile,
} from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export type Sentiment = 'GREAT' | 'GOOD' | 'FAIR' | 'BAD' | 'POOR';

const COLORS: Record<Sentiment, string> = {
  GREAT: '#43B92C',       // bright green
  GOOD: '#92C433',       // yellow-green
  FAIR:  '#E8C22B',       // yellow
  BAD:  '#F39F40',       // orange
  POOR:   '#D96500',       // red
};

const ICONS: Record<Sentiment, any> = {
  GREAT: Laugh,
  GOOD: Smile,
  FAIR: Meh,
  BAD: Frown,
  POOR:  Angry,
};

export function SentimentIcon({ value }: { value: Sentiment }) {
  const Icon = ICONS[value];
  return (
    <View className="items-center justify-center rounded-full">
      <Icon size={20} color={COLORS[value]} strokeWidth={2.4} />
    </View>
  );
}

export function SentimentRow({ items }: { items: Sentiment[] }) {
  return (
    <View className="flex-row gap-1 mt-1">
      {items.map((s, i) => (
        <SentimentIcon key={i} value={s} />
      ))}
    </View>
  );
}
