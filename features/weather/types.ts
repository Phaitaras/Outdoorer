export type HourWeather = {
  time: string;
  temperature_2m: number;
  weathercode: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  precipitation: number;
};

export type WeatherData = {
  units: 'metric' | 'imperial';
  current: HourWeather;
  dayHours: HourWeather[];
  next6: HourWeather[];
  hours?: HourWeather[];
  location: { lat: number; lon: number };
};
