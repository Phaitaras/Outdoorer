import React from 'react';
import { View } from 'react-native';
import {
  Laugh,
  Smile,
  Meh,
  Frown,
  Angry,
} from 'lucide-react-native';

export type Sentiment = 'IDEAL' | 'GREAT' | 'GOOD' | 'FAIR' | 'BAD';

const COLORS: Record<Sentiment, string> = {
  IDEAL: '#43B92C',       // bright green
  GREAT: '#92C433',       // yellow-green
  GOOD:  '#E8C22B',       // yellow
  FAIR:  '#F39F40',       // orange
  BAD:   '#D96500',       // red
};

const ICONS: Record<Sentiment, any> = {
  IDEAL: Laugh,
  GREAT: Smile,
  GOOD: Meh,
  FAIR: Frown,
  BAD:  Angry,
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
