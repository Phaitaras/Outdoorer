export type AvatarColor = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'cyan';

export const AVATAR_COLOR_HEX: Record<AvatarColor, string> = {
  red: '#DC2626',
  blue: '#2563EB',
  green: '#16A34A',
  purple: '#9333EA',
  orange: '#EA580C',
  pink: '#EC4899',
  yellow: '#CA8A04',
  cyan: '#0891B2',
};

export interface Friend {
  id: string;
  name: string;
  title: string;
  avatarUri?: string;
  avatarColor: AvatarColor;
}

export const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'John1', title: 'Novice Outdoorer', avatarColor: 'red' },
  { id: '2', name: 'Jane2', title: 'Runner', avatarColor: 'green' },
  { id: '3', name: 'Mike3', title: 'Rock Climber', avatarColor: 'purple' },
];

export const MOCK_ADD_FRIEND_ACCOUNT = {
  name: 'John123',
  title: 'Novice Outdoorer',
  avatarColor: 'orange' as const,
  activities: ['🏃‍♂️  Running', '🚴‍♀️  Cycling', '🥾  Hiking'],
  friendsCount: 15,
  activitiesCount: 42,
  reviewsCount: 5,
};
