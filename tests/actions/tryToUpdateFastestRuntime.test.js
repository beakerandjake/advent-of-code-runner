import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/statistics.js', () => ({
  getPuzzlesFastestRuntime: jest.fn(),
  setPuzzlesFastestRuntime: jest.fn(),
}));

// import mocks after setting up mocks
const { getPuzzlesFastestRuntime, setPuzzlesFastestRuntime } = await import(
  '../../src/statistics.js'
);
const { tryToUpdateFastestRuntime } = await import(
  '../../src/actions/tryToUpdateFastestRuntime.js'
);

describe('tryToUpdateFastestRuntime()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined, -1])('throws if runtime is: %s', async (runtimeNs) => {
    await expect(async () =>
      tryToUpdateFastestRuntime({
        year: 2022,
        day: 11,
        level: 1,
        runtimeNs,
      })
    ).rejects.toThrow();
  });

  test('sets if no previous record set', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(null);
    await tryToUpdateFastestRuntime({ runtimeNs: 1234 });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });

  test('does not set if record not broken', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(1234);
    await tryToUpdateFastestRuntime({ runtimeNs: 4321 });
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('sets if record is broken', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(4321);
    await tryToUpdateFastestRuntime({ runtimeNs: 1234 });
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });

  test('halts chain if record not broken', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(1234);
    const result = await tryToUpdateFastestRuntime({ runtimeNs: 4321 });
    expect(result).toBe(false);
  });

  test('returns true if updated', async () => {
    getPuzzlesFastestRuntime.mockResolvedValue(4321);
    const result = await tryToUpdateFastestRuntime({ runtimeNs: 1234 });
    expect(result).toBe(true);
  });
});
