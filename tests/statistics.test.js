import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger, mockConfig } from './mocks.js';

// setup mocks.
mockLogger();
const { getConfigValue } = mockConfig();

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
const {
  getPuzzlesFastestRuntime,
  setFastestExecutionTime,
  getPuzzleCompletionData,
  summarizeCompletionData,
} = await import('../src/statistics.js');

describe('statistics', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPuzzlesFastestRuntime()', () => {
    test('returns null if puzzle not found', async () => {
      findPuzzle.mockResolvedValue(null);
      const result = await getPuzzlesFastestRuntime(2022, 1, 1);
      expect(result).toBe(null);
    });

    test('returns null if value not set', async () => {
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: undefined });
      const result = await getPuzzlesFastestRuntime(2022, 1, 1);
      expect(result).toBe(null);
    });

    test('returns value if set', async () => {
      const expected = 324234324324;
      findPuzzle.mockResolvedValue({ fastestExecutionTimeNs: expected });
      const result = await getPuzzlesFastestRuntime(2022, 1, 1);
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

  describe('summarizeCompletionData()', () => {
    // mock the getConfigValues for calculating total puzzles.
    const mockTotalPuzzles = (days, parts) => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.days':
            return Array(days).fill(0);
          case 'aoc.validation.parts':
            return Array(parts).fill(0);
          default:
            return undefined;
        }
      });
    };

    test.each([
      null, {}, '', 1234, Promise.resolve(true), () => {},
    ])('throws if given: "%s"', (completionData) => {
      expect(() => summarizeCompletionData(completionData)).toThrow(TypeError);
    });

    test('throws if can\'t get total puzzle count', () => {
      mockTotalPuzzles(5, undefined);
      expect(() => summarizeCompletionData([]).toThrow(RangeError));
    });

    test('calculates averageNumberOfAttempts', () => {
      mockTotalPuzzles(5, 5);
      const attempts = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];
      const expected = attempts.reduce((acc, x) => acc + x, 0) / attempts.length;
      const input = attempts.map((x) => ({ numberOfAttempts: x }));
      const { averageNumberOfAttempts } = summarizeCompletionData(input);
      expect(averageNumberOfAttempts).toBe(expected);
    });

    test('averageNumberOfAttempts is null for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { averageNumberOfAttempts } = summarizeCompletionData([]);
      expect(averageNumberOfAttempts).toBe(null);
    });

    test('calculates maxAttempts', () => {
      mockTotalPuzzles(5, 5);
      const attempts = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];
      const expected = Math.max(...attempts);
      const input = attempts.map((x) => ({ numberOfAttempts: x }));
      const { maxAttempts } = summarizeCompletionData(input);
      expect(maxAttempts).toBe(expected);
    });

    test('maxAttempts is null for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { maxAttempts } = summarizeCompletionData([]);
      expect(maxAttempts).toBe(null);
    });

    test('calculates averageExecutionTimeNs', () => {
      mockTotalPuzzles(5, 5);
      const executionTimes = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];
      const expected = executionTimes.reduce((acc, x) => acc + x, 0) / executionTimes.length;
      const input = executionTimes.map((x) => ({ executionTimeNs: x }));
      const { averageExecutionTimeNs } = summarizeCompletionData(input);
      expect(averageExecutionTimeNs).toBe(expected);
    });

    test('averageExecutionTimeNs is null for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { averageExecutionTimeNs } = summarizeCompletionData([]);
      expect(averageExecutionTimeNs).toBe(null);
    });

    test('calculates minExecutionTime', () => {
      mockTotalPuzzles(5, 5);
      const executionTimes = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];
      const expected = Math.min(...executionTimes);
      const input = executionTimes.map((x) => ({ executionTimeNs: x }));
      const { minExecutionTime } = summarizeCompletionData(input);
      expect(minExecutionTime).toBe(expected);
    });

    test('minExecutionTime is null for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { minExecutionTime } = summarizeCompletionData([]);
      expect(minExecutionTime).toBe(null);
    });

    test('calculates maxExecutionTime', () => {
      mockTotalPuzzles(5, 5);
      const executionTimes = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];
      const expected = Math.max(...executionTimes);
      const input = executionTimes.map((x) => ({ executionTimeNs: x }));
      const { maxExecutionTime } = summarizeCompletionData(input);
      expect(maxExecutionTime).toBe(expected);
    });

    test('maxExecutionTime is null for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { maxExecutionTime } = summarizeCompletionData([]);
      expect(maxExecutionTime).toBe(null);
    });

    test('calculates numberSolved', () => {
      mockTotalPuzzles(5, 5);
      const solved = [false, true, true, false, false, false, true];
      const input = solved.map((x) => ({ solved: x }));
      const { numberSolved } = summarizeCompletionData(input);
      expect(numberSolved).toBe(solved.filter(Boolean).length);
    });

    test('numberSolved is 0 for empty input', () => {
      mockTotalPuzzles(5, 5);
      const { numberSolved } = summarizeCompletionData([]);
      expect(numberSolved).toBe(0);
    });

    test('calculates totalPuzzles', () => {
      const days = 5;
      const parts = 5;
      mockTotalPuzzles(days, parts);
      const { totalPuzzles } = summarizeCompletionData([]);
      expect(totalPuzzles).toBe(days * parts);
    });
  });
});
