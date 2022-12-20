import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/config.js', () => ({ getConfigValue: jest.fn() }));
jest.unstable_mockModule('src/answers.js', () => ({
  answersEqual: jest.fn(),
  getCorrectAnswer: jest.fn(),
}));
jest.unstable_mockModule('src/statistics.js', () => ({
  tryToSetFastestExecutionTime: jest.fn(),
}));
jest.unstable_mockModule('src/cli/actions/actionUtil.js', () => ({
  executeSolutionAndLog: jest.fn(),
  getYear: jest.fn(),
  puzzleIsUnlocked: jest.fn(),
}));

const { answersEqual, getCorrectAnswer } = await import('../../src/answers.js');
const { tryToSetFastestExecutionTime } = await import('../../src/statistics.js');
const { executeSolutionAndLog, getYear, puzzleIsUnlocked } = await import('../../src/cli/actions/actionUtil.js');
const { solve } = await import('../../src/cli/actions/solve.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('solve()', () => {
    test('throws if get year fails', async () => {
      getYear.mockImplementation(() => { throw new RangeError('Error'); });
      await expect(async () => solve(1, 1)).rejects.toThrow(RangeError);
      expect(executeSolutionAndLog).not.toHaveBeenCalled();
    });

    test('does not execute if puzzle locked', async () => {
      puzzleIsUnlocked.mockResolvedValue(false);
      await solve(1, 1);
      expect(executeSolutionAndLog).not.toHaveBeenCalled();
    });

    test('executes solution', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      executeSolutionAndLog.mockResolvedValue({});
      await solve(1, 1);
      expect(executeSolutionAndLog).toHaveBeenCalledTimes(1);
    });

    test('does not try to update stats if puzzle not successfully submitted', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      executeSolutionAndLog.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue(null);
      await solve(1, 1);
      expect(executeSolutionAndLog).toHaveBeenCalledTimes(1);
      expect(tryToSetFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('does not try to update stats if answer isn\'t correct ', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      executeSolutionAndLog.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(false);
      await solve(1, 1);
      expect(executeSolutionAndLog).toHaveBeenCalledTimes(1);
      expect(tryToSetFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('tries to update stats if answer is correct ', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      executeSolutionAndLog.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(true);
      await solve(1, 1);
      expect(executeSolutionAndLog).toHaveBeenCalledTimes(1);
      expect(tryToSetFastestExecutionTime).toHaveBeenCalledTimes(1);
    });
  });
});
