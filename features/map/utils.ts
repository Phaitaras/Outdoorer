import type { AvatarColor } from '@/constants/user';

export function getAvatarColor(userId?: string): AvatarColor {
  if (!userId) return 'blue';
  const colors: AvatarColor[] = [
    'red',
    'blue',
    'green',
    'purple',
    'orange',
    'pink',
    'yellow',
    'cyan',
  ];
  const hash = userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1);
  return colors[hash % colors.length];
}
