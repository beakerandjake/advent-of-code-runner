import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();

// import after mocks set up
const { assertPuzzleHasLevel } = await import(
  '../../src/actions/assertPuzzleHasLevel.js'
);

describe('assertPuzzleHasLevel()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns true if not last day', () => {
    const days = [1, 2, 3, 4, 5];
    getConfigValue.mockReturnValue(days);
    for (let i = 0; i < days.length - 1; i++) {
      const result = assertPuzzleHasLevel({ year: 2022, day: days[i], level: 1 });
      expect(result).toBe(true);
    }
  });

  test('returns false if last day and level is two', () => {
    const days = [1, 2, 3, 4, 5];
    getConfigValue.mockReturnValue(days);
    const result = assertPuzzleHasLevel({ year: 2022, day: days.at(-1), level: 2 });
    expect(result).toBe(false);
  });

  test('returns true if last day and level is one', () => {
    const days = [1, 2, 3, 4, 5];
    getConfigValue.mockReturnValue(days);
    const result = assertPuzzleHasLevel({ year: 2022, day: days.at(-1), level: 1 });
    expect(result).toBe(true);
  });
});
