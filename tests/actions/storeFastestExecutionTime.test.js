import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/statistics.js', () => ({ setPuzzlesFastestRuntime: jest.fn() }));

// import after mocks set up
const { setPuzzlesFastestRuntime } = await import('../../src/statistics.js');
const { storeFastestExecutionTime } = await import('../../src/actions/storeFastestExecutionTime.js');

describe('storeFastestExecutionTime()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null, undefined,
  ])('throws if execution time is: %s', async (executionTimeNs) => {
    await expect(async () => storeFastestExecutionTime({
      year: 2022, day: 1, level: 1, executionTimeNs,
    })).rejects.toThrow();
  });

  test('sets value', async () => {
    await storeFastestExecutionTime({
      year: 2022, day: 1, level: 1, executionTimeNs: 1234,
    });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });
});
