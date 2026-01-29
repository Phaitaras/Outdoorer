export interface UserProfile {
  id: string;
  username: string;
  title: string;
  activity_types: string[];
}

export interface ActivityReview {
  id: number;
  rating: number;
  description: string;
}

export interface ActivityWithReview {
  id: number;
  user_id: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  review?: ActivityReview | null;
}

export interface LocationModalLocation {
  latitude: number;
  longitude: number;
  title?: string | null;
  type?: string;
  activity: {
    id: string | number;
    user_id: string;
    activity_type: string;
    start_time: string;
    end_time: string;
    review?: Array<{ id: number; rating: number; description: string }> | null;
  };
}
