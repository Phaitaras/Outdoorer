import type { Sentiment } from '@/components/home/sentiment';

/**
 * Shared sentiment color palette used across the app
 */
export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  GREAT: '#7FD36E',
  GOOD: '#AFDF55',
  FAIR: '#FFD166',
  BAD: '#FF914D',
  POOR: '#FF5C5C',
};

/**
 * Sentiment values ordered from best to worst
 */
export const SENTIMENT_ROWS: Sentiment[] = ['GREAT', 'GOOD', 'FAIR', 'BAD', 'POOR'];
