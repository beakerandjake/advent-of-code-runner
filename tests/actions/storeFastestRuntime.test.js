import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/statistics.js', () => ({ setPuzzlesFastestRuntime: jest.fn() }));

// import after mocks set up
const { setPuzzlesFastestRuntime } = await import('../../src/statistics.js');
const { storeFastestRuntime } = await import('../../src/actions/storeFastestRuntime.js');

describe('storeFastestRuntime()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null, undefined,
  ])('throws if execution time is: %s', async (executionTimeNs) => {
    await expect(async () => storeFastestRuntime({
      year: 2022, day: 1, level: 1, executionTimeNs,
    })).rejects.toThrow();
  });

  test('sets value', async () => {
    await storeFastestRuntime({
      year: 2022, day: 1, level: 1, executionTimeNs: 1234,
    });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });
});
