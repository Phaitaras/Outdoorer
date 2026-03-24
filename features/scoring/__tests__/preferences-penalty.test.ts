import { computeFilterPenalty, type FilterState } from '@/features/scoring/calculator';
import { makeHourWeather } from '@/tests/fixtures/hourWeather';

function makeFilters(overrides: Partial<FilterState> = {}): FilterState {
  return {
    useWeatherPrefs: true,
    rainTolerance: 'light',
    tempMin: 8,
    tempMax: 28,
    windLevel: 1,
    ...overrides,
  };
}

describe('preferences penalty (computeFilterPenalty)', () => {
  it('returns 0 when filters are null', () => {
    const hour = makeHourWeather();
    expect(computeFilterPenalty(hour, null)).toBe(0);
  });

  it('returns 0 when useWeatherPrefs is false', () => {
    const hour = makeHourWeather();
    const filters = makeFilters({ useWeatherPrefs: false });
    expect(computeFilterPenalty(hour, filters)).toBe(0);
  });

  it('applies single rain violation penalty', () => {
    const hour = makeHourWeather({ precipitation: 0.2, precipitation_probability: 10 });
    const filters = makeFilters({ rainTolerance: 'clear' });
    expect(computeFilterPenalty(hour, filters)).toBe(10);
  });

  it('applies temperature and wind penalties together', () => {
    const hour = makeHourWeather({ temperature_2m: 35, wind_gusts_10m: 50, precipitation: 0, precipitation_probability: 0 });
    const filters = makeFilters({ rainTolerance: 'heavy', tempMin: 8, tempMax: 28, windLevel: 1 });
    expect(computeFilterPenalty(hour, filters)).toBe(20);
  });

  it('applies maximum 30 when rain + temp + wind are all violated', () => {
    const hour = makeHourWeather({
      precipitation: 1.2,
      precipitation_probability: 80,
      temperature_2m: 35,
      wind_gusts_10m: 50,
    });
    const filters = makeFilters({ rainTolerance: 'light', tempMin: 8, tempMax: 28, windLevel: 1 });
    expect(computeFilterPenalty(hour, filters)).toBe(30);
  });

  it('does not penalize high PoP for drizzle/light/moderate/heavy thresholds unless amount exceeds Pmax', () => {
    const hour = makeHourWeather({ precipitation: 0.2, precipitation_probability: 99 });
    const filters = makeFilters({ rainTolerance: 'drizzle' });
    expect(computeFilterPenalty(hour, filters)).toBe(0);
  });
});
