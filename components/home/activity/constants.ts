import type { Sentiment } from '@/components/home/sentiment';
import { SENTIMENT_ROWS } from '@/constants/sentiment';

export const ROWS = SENTIMENT_ROWS;

export type HourBar = { hour: string; sentiment: Sentiment };

export const GRAPH_DATA: HourBar[] = [
  { hour: '9:00', sentiment: 'GOOD' },
  { hour: '10:00', sentiment: 'GREAT' },
  { hour: '11:00', sentiment: 'GREAT' },
  { hour: '12:00', sentiment: 'GREAT' },
  { hour: '13:00', sentiment: 'GREAT' },
  { hour: '14:00', sentiment: 'GREAT' },
  { hour: '15:00', sentiment: 'GOOD' },
  { hour: '16:00', sentiment: 'FAIR' },
  { hour: '17:00', sentiment: 'FAIR' },
  { hour: '18:00', sentiment: 'FAIR' },
  { hour: '19:00', sentiment: 'BAD' },
  { hour: '20:00', sentiment: 'BAD' },
  { hour: '21:00', sentiment: 'POOR' },
  { hour: '22:00', sentiment: 'POOR' },
  { hour: '23:00', sentiment: 'POOR' },
  { hour: '00:00', sentiment: 'POOR' },
];

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
