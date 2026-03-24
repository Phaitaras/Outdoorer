import type { HourWeather } from '@/features/weather/types';

export function makeHourWeather(overrides: Partial<HourWeather> = {}): HourWeather {
  return {
    time: '2026-03-24T12:00',
    temperature_2m: 20,
    weathercode: 0,
    wind_speed_10m: 10,
    wind_direction_10m: 180,
    wind_gusts_10m: 20,
    precipitation: 0,
    dew_point_2m: 10,
    is_day: 1,
    precipitation_probability: 0,
    wave_height: 0.5,
    wave_period: 10,
    wind_wave_height: 0.2,
    ocean_current_velocity: 2,
    ...overrides,
  };
}
