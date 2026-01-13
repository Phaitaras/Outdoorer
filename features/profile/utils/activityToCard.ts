import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import type { Activity } from '../types';

export interface ActivityCard {
  id: string;
  activity: string;
  emoji: string;
  date: string;
  timeWindow: string;
}

/**
 * Convert an Activity object to an ActivityCard for display in ActivityCardsScroll
 */
export function activityToCard(activity: Activity): ActivityCard {
  const startTime = new Date(activity.start_time);
  const endTime = new Date(activity.end_time);
  const date = startTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const timeWindow = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  const activityDisplay = LABEL_TO_ACTIVITY[activity.activity_type] || activity.activity_type;

  return {
    id: activity.id.toString(),
    activity: activityDisplay,
    emoji: '',
    date,
    timeWindow,
  };
}
