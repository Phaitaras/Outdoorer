import { Angry, Frown, Laugh, Meh, Smile } from 'lucide-react-native';

export const ACTIVITIES = [
  { label: 'Running', value: 'Running' },
  { label: 'Cycling', value: 'Cycling' },
  { label: 'Hiking', value: 'Hiking' },
  { label: 'Rock Climbing', value: 'Rock Climbing' },
  { label: 'Kayaking', value: 'Kayaking' },
  { label: 'Sailing', value: 'Sailing' },
  { label: 'Surfing', value: 'Surfing' },
  { label: 'Kitesurfing', value: 'Kitesurfing' },
  { label: 'Windsurfing', value: 'Windsurfing' },
  { label: 'Generic Sport', value: 'Generic Sport' },
];

export { SENTIMENT_COLORS } from '@/constants/sentiment';

export const RAIN_OPTIONS = [
  { value: 'clear', label: 'Clear', Icon: Laugh, level: 0, sentiment: 'GREAT' },
  { value: 'drizzle', label: 'Drizzle', Icon: Smile, level: 1, sentiment: 'GOOD' },
  { value: 'light', label: 'Light\nRain', Icon: Meh, level: 2, sentiment: 'FAIR' },
  { value: 'moderate', label: 'Moderate\nRain', Icon: Frown, level: 3, sentiment: 'BAD' },
  { value: 'heavy', label: 'Heavy\nRain', Icon: Angry, level: 4, sentiment: 'POOR' },
] as const;

export const TEMP_VALUES = Array.from({ length: 41 }, (_, i) => -10 + i); // -10 .. 30

export type RainValue = (typeof RAIN_OPTIONS)[number]['value'];
