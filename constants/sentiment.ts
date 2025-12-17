import type { Sentiment } from '@/components/home/sentiment';


export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  GREAT: '#7FD36E',
  GOOD: '#AFDF55',
  FAIR: '#FFD166',
  BAD: '#FF914D',
  POOR: '#FF5C5C',
};

export const SENTIMENT_ROWS: Sentiment[] = ['GREAT', 'GOOD', 'FAIR', 'BAD', 'POOR'];
