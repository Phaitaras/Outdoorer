// OpenMeteo WMO Weather interpretation codes
export const WEATHER_CODE_TO_ICON: Record<number, string> = {
  // Clear sky
  0: 'sun', // Clear
  1: 'sun', // Mostly clear
  2: 'cloud', // Partly cloudy
  3: 'cloud', // Overcast

  // Fog, drizzle, rain
  45: 'cloud-fog', // Fog
  48: 'cloud-fog', // Icy Fog
  51: 'cloud-drizzle', // Light drizzle
  53: 'cloud-drizzle', // Drizzle
  55: 'cloud-drizzle', // Heavy Drizzle
  61: 'cloud-rain', // Light rain
  63: 'cloud-rain', // Rain
  65: 'cloud-rain', // Heavy rain
  80: 'cloud-rain', // Light rain showers
  81: 'cloud-rain', // Rain showers
  82: 'cloud-rain', // Heavy rain showers

  // Freezing
  56: 'cloud-snow', // Light Icy Drizzle
  57: 'cloud-snow', // Icy Drizzle
  66: 'cloud-snow', // Light Icy Rain
  67: 'cloud-snow', // Icy Rain
  71: 'cloud-snow', // Light snow
  73: 'cloud-snow', // Snow
  75: 'cloud-snow', // Heavy snow
  77: 'cloud-snow', // Snow grains
  85: 'cloud-snow', // Light snow showers
  86: 'cloud-snow', // Snow showers

  // Thunderstorm
  95: 'cloud-lightning', // Thunderstorm
  96: 'cloud-lightning', // Thunderstorm with light hail
  99: 'cloud-lightning', // Thunderstorm with hail
};

// Get description for weather code
export const WEATHER_CODE_TO_DESCRIPTION: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Icy Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Light Icy Drizzle',
  57: 'Icy Drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  85: 'Light snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with light hail',
  99: 'Thunderstorm with hail',
};
