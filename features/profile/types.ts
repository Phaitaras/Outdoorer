export type ActivityType = 
  | 'running'
  | 'cycling'
  | 'hiking'
  | 'rock_climbing'
  | 'kayaking'
  | 'sailing'
  | 'surfing'
  | 'kitesurfing'
  | 'windsurfing'
  | 'generic_sports';

export type MetricSystem = 'metric' | 'imperial';

export type Profile = {
  id: string;
  username: string;
  title: string;
  metric: MetricSystem;
  activity_types: ActivityType[];
  onboarded: boolean;
  created_at: string;
  activity_visibility?: 'public' | 'friends' | 'private';
};

export type Activity = {
  id: number;
  user_id: string;
  location_id: number | null;
  activity_type: ActivityType;
  start_time: string;
  end_time: string;
  created_at: string;
  location?: {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
  } | null;
};

export type ReviewDetail = {
  id: number;
  user_id: string;
  activity_id: number;
  rating: number;
  description: string;
  created_at: string;
  activity: {
    id: number;
    user_id: string;
    activity_type: ActivityType;
    start_time: string;
    end_time: string;
    location?: {
      id: number;
      name: string;
    } | null;
  } | null;
};

export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export type ProfileStats = {
  friendCount: number;
  activityCount: number;
  reviewCount: number;
};

export type ProfileWithStats = Profile & ProfileStats;

export type UserActivitiesParams = {
  userId: string;
  type: 'upcoming' | 'previous';
  limit?: number;
};
