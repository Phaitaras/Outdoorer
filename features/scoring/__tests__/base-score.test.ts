import { computeBaseScore } from '@/features/scoring/calculator';
import { makeHourWeather } from '@/tests/fixtures/hourWeather';

describe('base scoring model (computeBaseScore)', () => {
  it('returns 100 for ideal running conditions', () => {
    const hour = makeHourWeather({
      temperature_2m: 20,
      wind_gusts_10m: 20,
      precipitation: 0,
      precipitation_probability: 0,
      dew_point_2m: 10,
      is_day: 1,
    });

    expect(computeBaseScore(hour, 'running')).toBe(100);
  });

  it('applies night/daylight penalty for running', () => {
    const dayHour = makeHourWeather({ is_day: 1 });
    const nightHour = makeHourWeather({ is_day: 0 });

    const dayScore = computeBaseScore(dayHour, 'running');
    const nightScore = computeBaseScore(nightHour, 'running');

    expect(dayScore).toBe(100);
    expect(nightScore).toBeCloseTo(82, 5);
  });

  it('applies wind gust penalty linearly in running profile', () => {
    const hour = makeHourWeather({
      wind_gusts_10m: 55,
      is_day: 1,
      precipitation: 0,
      precipitation_probability: 0,
      temperature_2m: 20,
      dew_point_2m: 10,
    });

    // wind penalty = 100*(55-35)/(75-35)=50, weighted by 0.25 -> 12.5
    expect(computeBaseScore(hour, 'running')).toBeCloseTo(87.5, 5);
  });

  it('applies marine penalty for water sports', () => {
    const hour = makeHourWeather({
      temperature_2m: 25,
      wind_gusts_10m: 20,
      precipitation: 0,
      precipitation_probability: 0,
      dew_point_2m: 10,
      is_day: 1,
      wave_height: 2.0,
      wave_period: 6.0,
      wind_wave_height: 1.5,
      ocean_current_velocity: 8.0,
    });

    const surfingScore = computeBaseScore(hour, 'surfing');
    const runningScore = computeBaseScore(hour, 'running');

    expect(surfingScore).toBeLessThan(60);
    expect(runningScore).toBeGreaterThan(surfingScore);
  });
});
