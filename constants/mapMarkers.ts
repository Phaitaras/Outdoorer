// activity -> emoji
export const ACTIVITY_TYPE_TO_EMOJI: Record<string, string> = {
  running: '🏃‍♂️',
  cycling: '🚴‍♀️',
  hiking: '🥾',
  rock_climbing: '🧗',
  kayaking: '🛶',
  sailing: '⛵️',
  surfing: '🏄‍♂️',
  kitesurfing: '🪁',
  windsurfing: '🌬️',
  generic_sports: '⚽️',
};

export const DEFAULT_ACTIVITY_EMOJI = '🏃‍♂️';

export const MARKER_EMOJIS = {
  plan: '📋',
} as const;

export const INITIAL_REGION = {
  latitude: 55.863873,
  longitude: -4.292994,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
} as const;
