import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/statistics.js', () => ({
  getPuzzlesFastestRuntime: jest.fn(),
  setPuzzlesFastestRuntime: jest.fn(),
}));

// import mocks after setting up mocks
const { getPuzzlesFastestRuntime, setPuzzlesFastestRuntime } = await import('../../src/statistics.js');
const { tryToUpdateFastestExecutionTime } = await import('../../src/actions/tryToUpdateFastestExecutionTime.js');

describe('tryToUpdateFastestExecutionTime()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null, undefined, -1,
  ])('throws if execution time is: %s', async (executionTimeNs) => {
    await expect(async () => tryToUpdateFastestExecutionTime({
      year: 2022, day: 11, level: 1, executionTimeNs,
    })).rejects.toThrow();
  });

  test('sets if no previous record set', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(null);
    await tryToUpdateFastestExecutionTime({ executionTimeNs: 1234 });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });

  test('does not set if record not broken', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(1234);
    await tryToUpdateFastestExecutionTime({ executionTimeNs: 4321 });
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('sets if record is broken', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(4321);
    await tryToUpdateFastestExecutionTime({ executionTimeNs: 1234 });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });
});
