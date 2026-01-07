export const ACTIVITIES = [
  '🏃‍♂️  Running',
  '🚴‍♀️  Cycling',
  '🥾  Hiking',
  '🧗  Rock Climbing',
  '🛶  Kayaking',
  '⛵️  Sailing',
  '🏄‍♂️  Surfing',
  '🪁  Kitesurfing',
  '🌬️  Windsurfing',
  '⚽️  Generic / Others',
];

export const ACTIVITY_TO_LABEL: Record<string, string> = {
  '🏃‍♂️  Running': 'running',
  '🚴‍♀️  Cycling': 'cycling',
  '🥾  Hiking': 'hiking',
  '🧗  Rock Climbing': 'rock_climbing',
  '🛶  Kayaking': 'kayaking',
  '⛵️  Sailing': 'sailing',
  '🏄‍♂️  Surfing': 'surfing',
  '🪁  Kitesurfing': 'kitesurfing',
  '🌬️  Windsurfing': 'windsurfing',
  '⚽️  Generic / Others': 'generic_sports',
};

export const LABEL_TO_ACTIVITY: Record<string, string> = Object.fromEntries(
  Object.entries(ACTIVITY_TO_LABEL).map(([label, enumVal]) => [enumVal, label])
) as Record<string, string>;
