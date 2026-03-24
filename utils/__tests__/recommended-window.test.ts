import { type HourBar, findRecommendedWindow } from '@/utils/activity';

function bars(sentiments: HourBar['sentiment'][]): HourBar[] {
  return sentiments.map((sentiment, idx) => ({
    hour: `${String(idx).padStart(2, '0')}:00`,
    sentiment,
    score: 0,
  }));
}

describe('recommended window (findRecommendedWindow)', () => {
  it('returns {0,0} for empty input', () => {
    expect(findRecommendedWindow([])).toEqual({ start: 0, end: 0 });
  });

  it('prioritizes higher sentiment over longer lower-sentiment run', () => {
    const data = bars(['GOOD', 'GOOD', 'GOOD', 'FAIR', 'FAIR', 'FAIR', 'FAIR']);
    expect(findRecommendedWindow(data)).toEqual({ start: 0, end: 2 });
  });

  it('chooses longer run when sentiment ranks are equal', () => {
    const data = bars(['GOOD', 'GOOD', 'BAD', 'GOOD', 'GOOD', 'GOOD']);
    expect(findRecommendedWindow(data)).toEqual({ start: 3, end: 5 });
  });

  it('keeps earliest run when rank and span are equal', () => {
    const data = bars(['FAIR', 'FAIR', 'BAD', 'FAIR', 'FAIR']);
    expect(findRecommendedWindow(data)).toEqual({ start: 0, end: 1 });
  });

  it('keeps earliest singleton when all runs have equal span (implementation tie behavior)', () => {
    const data = bars(['BAD', 'GOOD', 'POOR', 'GREAT', 'FAIR']);
    expect(findRecommendedWindow(data)).toEqual({ start: 0, end: 0 });
  });

  it('returns full span when all sentiments are identical', () => {
    const data = bars(['GOOD', 'GOOD', 'GOOD', 'GOOD']);
    expect(findRecommendedWindow(data)).toEqual({ start: 0, end: 3 });
  });
});
