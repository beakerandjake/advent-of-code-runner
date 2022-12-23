import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/statistics.js', () => ({ setFastestExecutionTime: jest.fn() }));

// import after mocks set up
const { setFastestExecutionTime } = await import('../../src/statistics.js');
const { storeFastestExecutionTime } = await import('../../src/actions/links/storeFastestExecutionTime.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('storeFastestExecutionTime()', () => {
      test('sets value', async () => {
        await storeFastestExecutionTime({
          year: 2022, day: 1, part: 1, executionTimeNs: 1234,
        });
        expect(setFastestExecutionTime).toHaveBeenCalled();
      });
    });
  });
});
