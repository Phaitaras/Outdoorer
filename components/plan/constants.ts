import { ACTIVITIES as ACTIVITY_LABELS } from '@/constants/activities';
import { TEMP_VALUES_METRIC } from '@/utils/units';
import { Angry, Frown, Laugh, Meh, Smile, Sun, CloudSnow, CloudHail, CloudRain, CloudRainWind } from 'lucide-react-native';

export const ACTIVITIES = ACTIVITY_LABELS.map((label) => ({
  label,
  value: label,
}));

export { SENTIMENT_COLORS } from '@/constants/sentiment';
export { TEMP_VALUES_IMPERIAL, TEMP_VALUES_METRIC } from '@/utils/units';

export const RAIN_OPTIONS = [
  { value: 'clear', label: 'Clear', Icon: Sun, level: 0, sentiment: 'GREAT' },
  { value: 'drizzle', label: 'Drizzle', Icon: CloudSnow, level: 1, sentiment: 'GOOD' },
  { value: 'light', label: 'Light\nRain', Icon: CloudHail, level: 2, sentiment: 'FAIR' },
  { value: 'moderate', label: 'Moderate\nRain', Icon: CloudRain, level: 3, sentiment: 'BAD' },
  { value: 'heavy', label: 'Heavy\nRain', Icon: CloudRainWind, level: 4, sentiment: 'POOR' },
] as const;


export const TEMP_VALUES = TEMP_VALUES_METRIC;

export type RainValue = (typeof RAIN_OPTIONS)[number]['value'];
