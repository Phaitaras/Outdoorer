import type { Sentiment } from '@/components/home/sentiment';
import { SENTIMENT_ROWS } from '@/constants/sentiment';

export const ROWS = SENTIMENT_ROWS;

export { SENTIMENT_COLORS } from '@/constants/sentiment';

export const BAR_HEIGHT_CLASS: Record<Sentiment, string> = {
  POOR: 'h-[2.4rem]',
  BAD: 'h-[4.8rem]',
  FAIR: 'h-[7.2rem]',
  GOOD: 'h-[9.6rem]',
  GREAT: 'h-[12rem]',
};

export const BAR_FILL_COLOR: Record<Sentiment, string> = {
  GREAT: '#CFE8C4',
  GOOD: '#DDECBD',
  FAIR: '#F4E9C3',
  BAD: '#F8D1BC',
  POOR: '#F8BCBC',
};
