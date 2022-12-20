import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({
  addIncorrectAnswer: jest.fn(),
  setCorrectAnswer: jest.fn(),
}));
jest.unstable_mockModule('src/actions/actionUtil.js', () => ({
  getYear: jest.fn(),
  puzzleIsUnlocked: jest.fn(),
}));
jest.unstable_mockModule('src/statistics.js', () => ({ setFastestExecutionTime: jest.fn() }));
jest.unstable_mockModule('src/actions/getInputAndExecuteSolution.js', () => ({ getInputAndExecuteSolution: jest.fn() }));
jest.unstable_mockModule('src/actions/tryToSubmitPuzzleAnswer.js', () => ({ tryToSubmitPuzzleAnswer: jest.fn() }));

// import mocks after setting up mocks
const { addIncorrectAnswer, setCorrectAnswer } = await import('../../src/answers.js');
const { setFastestExecutionTime } = await import('../../src/statistics.js');
const { getYear, puzzleIsUnlocked } = await import('../../src/actions/actionUtil.js');
const { getInputAndExecuteSolution } = await import('../../src/actions/getInputAndExecuteSolution.js');
const { tryToSubmitPuzzleAnswer } = await import('../../src/actions/tryToSubmitPuzzleAnswer.js');
const { solvePuzzleAndSubmitAnswer } = await import('../../src/actions/solvePuzzleAndSubmitAnswer.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('solvePuzzleAndSubmitAnswer()', () => {
    test('does not run if puzzle is locked', async () => {
      puzzleIsUnlocked.mockResolvedValue(false);
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(getInputAndExecuteSolution).not.toHaveBeenCalled();
      expect(tryToSubmitPuzzleAnswer).not.toHaveBeenCalled();
    });

    test('executes user solution', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({});
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(getInputAndExecuteSolution).toHaveBeenCalled();
    });

    test('throws if user solution throws', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockRejectedValue(new Error());
      await expect(async () => solvePuzzleAndSubmitAnswer(1, 1)).rejects.toThrow();
      expect(tryToSubmitPuzzleAnswer).not.toHaveBeenCalled();
    });

    test('submits answer', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({});
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(tryToSubmitPuzzleAnswer).toHaveBeenCalled();
    });

    test('adds incorrect answer if not correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: false });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(addIncorrectAnswer).toHaveBeenCalled();
    });

    test('does not set correct answer if not correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: false });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(setCorrectAnswer).not.toHaveBeenCalled();
    });

    test('does not set fastest execution time if not correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: false });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(setFastestExecutionTime).not.toHaveBeenCalled();
    });

    test('does not add incorrect answer if correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: true });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(addIncorrectAnswer).not.toHaveBeenCalled();
    });

    test('sets correct answer if correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: true });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(setCorrectAnswer).toHaveBeenCalled();
    });

    test('sets fastest execution time if correct', async () => {
      puzzleIsUnlocked.mockResolvedValue(true);
      getInputAndExecuteSolution.mockResolvedValue({});
      tryToSubmitPuzzleAnswer.mockResolvedValue({ success: true });
      await solvePuzzleAndSubmitAnswer(1, 1);
      expect(setFastestExecutionTime).toHaveBeenCalled();
    });
  });
});
