export type HourWeather = {
  time: string;
  temperature_2m: number;
  weathercode: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  precipitation: number;
  dew_point_2m: number;
  is_day: number;
  precipitation_probability: number;
  wave_height?: number | null;
  wave_period?: number | null;
  wind_wave_height?: number | null;
  ocean_current_velocity?: number | null;
};

export type WeatherData = {
  units: 'metric' | 'imperial';
  date: string; // YYYY-MM-DD format
  current: HourWeather | null; // null for future dates
  dayHours: HourWeather[];
  next6: HourWeather[];
  hours?: HourWeather[];
  location: { lat: number; lon: number };
};
