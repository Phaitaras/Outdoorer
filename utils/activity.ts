import type { Sentiment } from '@/components/home/sentiment';

export type HourBar = {
  hour: string;
  sentiment: Sentiment;
  score: number; // 0-100 for dynamic height scaling
};

const SENTIMENT_RANK: Record<Sentiment, number> = {
  POOR: 0,
  BAD: 1,
  FAIR: 2,
  GOOD: 3,
  GREAT: 4,
};

/**
 * finds the best window of recommended conditions in the graph data
 * prioritize higher sentiment, then longer duration at the same sentiment level.
 * @param data - Array of hourly sentiment data
 */
export function findRecommendedWindow(data: HourBar[]): { start: number; end: number } {
  if (data.length === 0) {
    return { start: 0, end: 0 };
  }

  let bestStart = 0;
  let bestEnd = 0;
  let bestOrder = -1;
  let bestLength = 0;

  let currentStart = 0;
  let currentOrder = SENTIMENT_RANK[data[0].sentiment];

  data.forEach((bar, index) => {
    const order = SENTIMENT_RANK[bar.sentiment];
    if (order === currentOrder) {
      const length = index - currentStart;
      const isBetterOrder = order > bestOrder;
      const isEqualOrderLonger = order === bestOrder && length > bestLength;
      if (isBetterOrder || isEqualOrderLonger) {
        bestStart = currentStart;
        bestEnd = index;
        bestOrder = order;
        bestLength = length;
      }
    } else {
      currentStart = index;
      currentOrder = order;
    }
  });

  return { start: bestStart, end: bestEnd };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatActivityDate(startTime: string): string {
  return new Date(startTime).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatActivityTime(startTime: string, endTime: string): string {
  return `${formatTime(new Date(startTime))} - ${formatTime(new Date(endTime))}`;
}
