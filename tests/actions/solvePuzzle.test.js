import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({
  answersEqual: jest.fn(),
  getCorrectAnswer: jest.fn(),
}));

jest.unstable_mockModule('src/actions/actionUtil.js', () => ({
  getYear: jest.fn(),
  puzzleIsUnlocked: jest.fn(),
}));

jest.unstable_mockModule('src/actions/getInputAndExecuteSolution.js', () => ({
  getInputAndExecuteSolution: jest.fn(),
}));

jest.unstable_mockModule('src/actions/tryToUpdateFastestExecutionTime.js', () => ({
  tryToUpdateFastestExecutionTime: jest.fn(),
}));

// import mocks after setting up mocks
const { answersEqual, getCorrectAnswer } = await import('../../src/answers.js');
const { getYear, puzzleIsUnlocked } = await import('../../src/actions/actionUtil.js');
const { getInputAndExecuteSolution } = await import('../../src/actions/getInputAndExecuteSolution.js');
const { tryToUpdateFastestExecutionTime } = await import('../../src/actions/tryToUpdateFastestExecutionTime.js');
const { solvePuzzle } = await import('../../src/actions/solvePuzzle.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('solvePuzzle()', () => {
    test('throws if get year fails', async () => {
      getYear.mockImplementation(() => { throw new RangeError('Error'); });
      await expect(async () => solvePuzzle(1, 1)).rejects.toThrow(RangeError);
      expect(getInputAndExecuteSolution).not.toHaveBeenCalled();
    });

    test('does not execute if puzzle locked', async () => {
      puzzleIsUnlocked.mockResolvedValue(false);
      await solvePuzzle(1, 1);
      expect(getInputAndExecuteSolution).not.toHaveBeenCalled();
    });

    test('executes if puzzle not locked', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      await solvePuzzle(1, 1);
      expect(getInputAndExecuteSolution).toHaveBeenCalled();
    });

    test('does not update fastest execution time if puzzle not solved', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue(null);
      await solvePuzzle(1, 1);
      expect(tryToUpdateFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('does not update fastest execution time if answer incorrect', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(false);
      await solvePuzzle(1, 1);
      expect(tryToUpdateFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('updates fastest execution time if answer correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      getCorrectAnswer.mockResolvedValue('ASDF');
      answersEqual.mockReturnValue(true);
      await solvePuzzle(1, 1);
      expect(tryToUpdateFastestExecutionTime).toHaveBeenCalled();
    });
  });
});
