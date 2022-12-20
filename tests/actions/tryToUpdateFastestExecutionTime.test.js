import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/answers.js', () => ({
  getCorrectAnswer: jest.fn(),
  answersEqual: jest.fn(),
}));

jest.unstable_mockModule('src/statistics.js', () => ({
  getFastestExecutionTime: jest.fn(),
  setFastestExecutionTime: jest.fn(),
}));

// import mocks after setting up mocks
const { getCorrectAnswer, answersEqual } = await import('../../src/answers.js');
const { getFastestExecutionTime, setFastestExecutionTime } = await import('../../src/statistics.js');
const { tryToUpdateFastestExecutionTime } = await import('../../src/actions/tryToUpdateFastestExecutionTime.js');

// import { getCorrectAnswer, answersEqual } from '../answers.js';
// import { logger } from '../logger.js';
// import { getFastestExecutionTime, setFastestExecutionTime } from '../statistics';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('tryToUpdateFastestExecutionTime()', () => {
    test('does not set if puzzle not answered', async () => {
      getCorrectAnswer.mockResolvedValue(null);
      await tryToUpdateFastestExecutionTime(1, 2, 3, {});
      expect(setFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('does not set if answer is not correct', async () => {
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(false);
      await tryToUpdateFastestExecutionTime(1, 2, 3, {});
      expect(setFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('does not set if record not broken', async () => {
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(true);
      getFastestExecutionTime.mockResolvedValue(1234);
      await tryToUpdateFastestExecutionTime(1, 2, 3, { executionTimeNs: 4321 });
      expect(setFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('sets if record is broken', async () => {
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(true);
      getFastestExecutionTime.mockResolvedValue(4321);
      await tryToUpdateFastestExecutionTime(1, 2, 3, { executionTimeNs: 1234 });
      expect(setFastestExecutionTime).toHaveBeenCalled();
    });
  });
});
