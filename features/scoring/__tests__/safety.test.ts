import { isCritical } from '@/features/scoring/safety';
import { makeHourWeather } from '@/tests/fixtures/hourWeather';

describe('safety overrides (isCritical)', () => {
  it('returns true for global critical weathercode', () => {
    const hour = makeHourWeather({ weathercode: 95 });
    expect(isCritical(hour, 'running')).toBe(true);
  });

  it('returns true for global wind gust critical threshold', () => {
    const hour = makeHourWeather({ wind_gusts_10m: 63 });
    expect(isCritical(hour, 'hiking')).toBe(true);
  });

  it('returns true for running extreme heat with high dew point', () => {
    const hour = makeHourWeather({ temperature_2m: 38, dew_point_2m: 19 });
    expect(isCritical(hour, 'running')).toBe(true);
  });

  it('returns false for running high temperature when dew point is low', () => {
    const hour = makeHourWeather({ temperature_2m: 38, dew_point_2m: 15 });
    expect(isCritical(hour, 'running')).toBe(false);
  });

  it('returns true for sport-specific precipitation threshold (rock climbing > 3.0mm)', () => {
    const hour = makeHourWeather({ precipitation: 3.1 });
    expect(isCritical(hour, 'rock_climbing')).toBe(true);
  });

  it('returns false at rock climbing precipitation boundary (3.0mm)', () => {
    const hour = makeHourWeather({ precipitation: 3.0 });
    expect(isCritical(hour, 'rock_climbing')).toBe(false);
  });

  it('returns true when cycling gust exceeds 50 km/h', () => {
    const hour = makeHourWeather({ wind_gusts_10m: 51 });
    expect(isCritical(hour, 'cycling')).toBe(true);
  });

  it('returns false at cycling gust boundary (50 km/h)', () => {
    const hour = makeHourWeather({ wind_gusts_10m: 50 });
    expect(isCritical(hour, 'cycling')).toBe(false);
  });

  it('returns true for sport-specific minimum wind threshold (kitesurfing)', () => {
    const hour = makeHourWeather({ wind_gusts_10m: 18 });
    expect(isCritical(hour, 'kitesurfing')).toBe(true);
  });

  it('returns false for normal non-critical conditions', () => {
    const hour = makeHourWeather();
    expect(isCritical(hour, 'cycling')).toBe(false);
  });
});
