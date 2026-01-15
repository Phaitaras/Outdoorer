import { GRAPH_DATA } from '@/components/home/activity/constants';
import type { Sentiment } from '@/components/home/sentiment';

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
 */
export function findRecommendedWindow(): { start: number; end: number } {
  let bestStart = 0;
  let bestEnd = 0;
  let bestOrder = -1;
  let bestLength = 0;

  let currentStart = 0;
  let currentOrder = SENTIMENT_RANK[GRAPH_DATA[0].sentiment];

  GRAPH_DATA.forEach((bar, index) => {
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
