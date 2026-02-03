export const LOCATION_PICKER_CONSTANTS = {
  DEFAULT_DELTA: 0.01,
  ZOOM_DELTA: 0.005,
  ANIMATION_DURATION: 300,
} as const;

export const MAP_STYLE = {
  MARKER_SIZE: 40,
  SEARCH_BAR_TOP: 16,
  BUTTON_BOTTOM: 32,
} as const;

export interface AutocompleteResult {
  completionUrl: string;
  displayLines: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  structuredAddress?: {
    locality?: string;
    postCode?: string;
    country?: string;
    countryCode?: string;
  };
}
