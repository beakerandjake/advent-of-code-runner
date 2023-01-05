import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from './mocks.js';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/persistence/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
  addOrEditPuzzle: jest.fn(),
  createPuzzle: jest.fn(),
  getPuzzles: jest.fn(),
}));

jest.unstable_mockModule('src/validation/validationUtils.js', () => ({
  parsePositiveInt: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const {
  addOrEditPuzzle, findPuzzle, createPuzzle, getPuzzles,
} = await import('../src/persistence/puzzleRepository.js');
const { parsePositiveInt } = await import('../src/validation/validationUtils.js');
const { getFastestExecutionTime, setFastestExecutionTime, getPuzzleCompletionData } = await import('../src/statistics.js');

describe('statistics', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getFastestExecutionTime()', () => {
    test('returns null if puzzle not found', async () => {
      findPuzzle.mockResolvedValue(null);
      const result = await getFastestExecutionTime(2022, 1, 1);
      expect(result).toBe(null);
    });

    test('returns null if value not set', async () => {
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: undefined });
      const result = await getFastestExecutionTime(2022, 1, 1);
      expect(result).toBe(null);
    });

    test('returns value if set', async () => {
      const expected = 324234324324;
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: expected });
      const result = await getFastestExecutionTime(2022, 1, 1);
      expect(result).toBe(expected);
    });
  });

  describe('setFastestExecutionTime()', () => {
    test('throws if not positive int', async () => {
      parsePositiveInt.mockImplementation(() => { throw new RangeError('NOPE'); });
      await expect(async () => setFastestExecutionTime(2022, 1, 1)).rejects.toThrow(RangeError);
      expect(addOrEditPuzzle).not.toHaveBeenCalled();
    });

    test('creates puzzle if not found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue(null);
      await setFastestExecutionTime(2022, 1, 1, time);
      expect(createPuzzle).toHaveBeenCalledTimes(1);
    });

    test('creates puzzle if not found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue(null);
      await setFastestExecutionTime(2022, 1, 1, time);
      expect(createPuzzle).toHaveBeenCalledTimes(1);
    });

    test('does not create if puzzle is found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: null });
      await setFastestExecutionTime(2022, 1, 1, time);
      expect(createPuzzle).not.toHaveBeenCalled();
    });

    test('sets fastestExecutionTime to value', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: null });
      await setFastestExecutionTime(2022, 1, 1, time);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ fastestExecutionTimeNs: time });
    });
  });

  describe('getPuzzleCompletionData()', () => {
    const mockPuzzle = (year, day, part, correctAnswer = '', incorrectAnswers = [], fastestExecutionTimeNs = null) => ({
      year,
      day,
      part,
      correctAnswer,
      incorrectAnswers,
      fastestExecutionTimeNs,
    });

    test('returns empty array if no puzzles', async () => {
      getPuzzles.mockResolvedValue([]);
      const result = await getPuzzleCompletionData(2022);
      expect(result).toEqual([]);
    });

    test('returns empty array if no puzzles matching year', async () => {
      getPuzzles.mockResolvedValue([{ year: 2010 }, { year: 2011 }, { year: 2003 }]);
      const result = await getPuzzleCompletionData(2022);
      expect(result).toEqual([]);
    });

    test('returns each matching puzzle', async () => {
      const year = 2022;
      const expected = [
        mockPuzzle(year, 1, 1),
        mockPuzzle(year, 1, 2),
        mockPuzzle(year, 2, 1),
        mockPuzzle(year, 2, 2),
      ];
      getPuzzles.mockResolvedValue([...expected, mockPuzzle(2011, 1, 1), mockPuzzle(2015, 1, 2)]);
      const result = await getPuzzleCompletionData(year);
      expect(result).toHaveLength(expected.length);
    });

    test('calculates solved correctly', async () => {
      const year = 2022;
      const expected = [
        mockPuzzle(year, 1, 1, 'ASDF'),
        mockPuzzle(year, 1, 2, '1234'),
        mockPuzzle(year, 2, 1),
        mockPuzzle(year, 2, 2),
      ];
      getPuzzles.mockResolvedValue(expected);
      const result = await getPuzzleCompletionData(year);
      expected.forEach(
        (x, index) => expect(result[index].solved).toBe(!!x.correctAnswer),
      );
    });

    test('only returns execution time if solved', async () => {
      const year = 2022;
      const puzzles = [
        mockPuzzle(year, 1, 1, 'ASDF', [], 1234),
        mockPuzzle(year, 1, 2, '1234', [], 5432),
        mockPuzzle(year, 2, 1, null, [], 1234),
        mockPuzzle(year, 2, 2),
      ];
      getPuzzles.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      puzzles.forEach((x, index) => {
        const expected = x.correctAnswer ? x.fastestExecutionTimeNs : null;
        expect(result[index].executionTimeNs).toBe(expected);
      });
    });

    test('numberOfAttempts is 1 if solved with no wrong answers', async () => {
      const year = 2022;
      const puzzles = [
        mockPuzzle(year, 1, 1, 'ASDF', [], 1234),
      ];
      getPuzzles.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(1);
    });

    test('numberOfAttempts is correct if solved with wrong answers', async () => {
      const year = 2022;
      const wrongAnswers = ['1234', 'sadf', 'zxcv', 'qwer'];
      const puzzles = [
        mockPuzzle(year, 1, 1, 'ASDF', wrongAnswers, 1234),
      ];
      getPuzzles.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(wrongAnswers.length + 1);
    });

    test('numberOfAttempts is zero if unsolved and no wrong answers', async () => {
      const year = 2022;
      getPuzzles.mockResolvedValue([mockPuzzle(year, 1, 1)]);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(0);
    });

    test('numberOfAttempts is correct if unsolved with wrong answers', async () => {
      const year = 2022;
      const wrongAnswers = ['1234', 'sadf', 'zxcv', 'qwer', 'cvbx', 'rety'];
      getPuzzles.mockResolvedValue([mockPuzzle(year, 1, 1, null, wrongAnswers)]);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(wrongAnswers.length);
    });
  });
});
