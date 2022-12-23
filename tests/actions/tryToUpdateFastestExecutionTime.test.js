import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/statistics.js', () => ({
  getFastestExecutionTime: jest.fn(),
  setFastestExecutionTime: jest.fn(),
}));

// import mocks after setting up mocks
const { getFastestExecutionTime, setFastestExecutionTime } = await import('../../src/statistics.js');
const { tryToUpdateFastestExecutionTime } = await import('../../src/actions/links/tryToUpdateFastestExecutionTime.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('tryToUpdateFastestExecutionTime()', () => {
    test('sets if no previous record set', async () => {
      getFastestExecutionTime.mockResolvedValue(null);
      await tryToUpdateFastestExecutionTime({ executionTimeNs: 1234 });
      expect(setFastestExecutionTime).toHaveBeenCalled();
    });

    test('does not set if record not broken', async () => {
      getFastestExecutionTime.mockResolvedValue(1234);
      await tryToUpdateFastestExecutionTime({ executionTimeNs: 4321 });
      expect(setFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('sets if record is broken', async () => {
      getFastestExecutionTime.mockResolvedValue(4321);
      await tryToUpdateFastestExecutionTime({ executionTimeNs: 1234 });
      expect(setFastestExecutionTime).toHaveBeenCalled();
    });
  });
});
