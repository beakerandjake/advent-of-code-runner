import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from './mocks.js';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/persistence/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
  addOrEditPuzzle: jest.fn(),
  createPuzzle: jest.fn(),
  getPuzzlesForYear: jest.fn(),
}));

jest.unstable_mockModule('src/validation/validationUtils.js', () => ({
  parsePositiveInt: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { addOrEditPuzzle, findPuzzle, createPuzzle, getPuzzlesForYear } =
  await import('../src/persistence/puzzleRepository.js');
const { parsePositiveInt } = await import(
  '../src/validation/validationUtils.js'
);
const {
  setPuzzlesFastestRuntime,
  getFastestRuntime,
  getSlowestRuntime,
  getAverageRuntime,
  getMaxAttempts,
  getAverageAttempts,
  getSolvedCount,
  getPuzzleCompletionData,
  beatsFastestRuntime,
} = await import('../src/statistics.js');

describe('statistics', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('setPuzzlesFastestRuntime()', () => {
    test('throws if not positive int', async () => {
      parsePositiveInt.mockImplementation(() => {
        throw new RangeError('NOPE');
      });
      await expect(async () =>
        setPuzzlesFastestRuntime(2022, 1, 1)
      ).rejects.toThrow(RangeError);
      expect(addOrEditPuzzle).not.toHaveBeenCalled();
    });

    test('creates puzzle if not found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue(null);
      await setPuzzlesFastestRuntime(2022, 1, 1, time);
      expect(createPuzzle).toHaveBeenCalledTimes(1);
    });

    test('creates puzzle if not found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue(null);
      await setPuzzlesFastestRuntime(2022, 1, 1, time);
      expect(createPuzzle).toHaveBeenCalledTimes(1);
    });

    test('does not create if puzzle is found', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: null });
      await setPuzzlesFastestRuntime(2022, 1, 1, time);
      expect(createPuzzle).not.toHaveBeenCalled();
    });

    test('sets fastestRuntimeNs to value', async () => {
      const time = 123213;
      parsePositiveInt.mockReturnValue(time);
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: null });
      await setPuzzlesFastestRuntime(2022, 1, 1, time);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ fastestRuntimeNs: time });
    });
  });

  describe('getFastestRuntime()', () => {
    test('returns null if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getFastestRuntime(2022);
      expect(result).toBe(null);
    });

    test('returns value if only one puzzle for year', async () => {
      const expected = 1234;
      getPuzzlesForYear.mockResolvedValue([{ fastestRuntimeNs: expected }]);
      const result = await getFastestRuntime(2022);
      expect(result).toBe(expected);
    });

    test('returns min value', async () => {
      const expected = 1234;
      getPuzzlesForYear.mockResolvedValue([
        { fastestRuntimeNs: expected },
        { fastestRuntimeNs: expected + 2 },
        { fastestRuntimeNs: expected + 10 },
      ]);
      const result = await getFastestRuntime(2022);
      expect(result).toBe(expected);
    });
  });

  describe('getSlowestRuntime()', () => {
    test('returns null if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getSlowestRuntime(2022);
      expect(result).toBe(null);
    });

    test('returns value if only one puzzle for year', async () => {
      const expected = 1234;
      getPuzzlesForYear.mockResolvedValue([{ fastestRuntimeNs: expected }]);
      const result = await getSlowestRuntime(2022);
      expect(result).toBe(expected);
    });

    test('returns min value', async () => {
      const expected = 1234;
      getPuzzlesForYear.mockResolvedValue([
        { fastestRuntimeNs: expected },
        { fastestRuntimeNs: expected - 2 },
        { fastestRuntimeNs: expected - 10 },
      ]);
      const result = await getSlowestRuntime(2022);
      expect(result).toBe(expected);
    });
  });

  describe('getAverageRuntime()', () => {
    test('returns null if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getAverageRuntime(2022);
      expect(result).toBe(null);
    });

    test('returns value if only one puzzle for year', async () => {
      const expected = 1234;
      getPuzzlesForYear.mockResolvedValue([{ fastestRuntimeNs: expected }]);
      const result = await getAverageRuntime(2022);
      expect(result).toBe(expected);
    });

    test('calculates average', async () => {
      const runtimes = [1234, 345634, 238, 12394];
      getPuzzlesForYear.mockResolvedValue(
        runtimes.map((x) => ({ fastestRuntimeNs: x }))
      );
      const result = await getAverageRuntime(2022);
      expect(result).toBe(
        runtimes.reduce((acc, x) => acc + x, 0) / runtimes.length
      );
    });
  });

  describe('getMaxAttempts()', () => {
    test('returns null if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getMaxAttempts(2022);
      expect(result).toBe(null);
    });

    test('counts correct answer', async () => {
      getPuzzlesForYear.mockResolvedValue([
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
      ]);
      const result = await getMaxAttempts(2022);
      expect(result).toBe(1);
    });

    test('counts incorrect answers', async () => {
      const answers = ['ASDF', '1234', 'fdsa'];
      getPuzzlesForYear.mockResolvedValue([
        { correctAnswer: null, incorrectAnswers: answers },
      ]);
      const result = await getMaxAttempts(2022);
      expect(result).toBe(answers.length);
    });

    test('counts correct and incorrect answers', async () => {
      const answers = ['ASDF', '1234', 'fdsa'];
      getPuzzlesForYear.mockResolvedValue([
        { correctAnswer: 'ASDF', incorrectAnswers: answers },
      ]);
      const result = await getMaxAttempts(2022);
      expect(result).toBe(answers.length + 1);
    });

    test('finds max', async () => {
      const answers = ['ASDF', '1234', 'fdsa', '1432', '45645'];
      getPuzzlesForYear.mockResolvedValue([
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: ['ASDF'] },
        { correctAnswer: null, incorrectAnswers: [] },
        { correctAnswer: null, incorrectAnswers: ['!@#$', 'ASDF', 'ZXCV'] },
        { correctAnswer: 'ASDF', incorrectAnswers: answers },
      ]);
      const result = await getMaxAttempts(2022);
      expect(result).toBe(answers.length + 1);
    });
  });

  describe('getAverageAttempts()', () => {
    test('returns null if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getAverageAttempts(2022);
      expect(result).toBe(null);
    });

    test('calculates average', async () => {
      const data = [
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: ['ASDF', '1234', 'zxcv'] },
        { correctAnswer: null, incorrectAnswers: ['ASDF', 'zxcv'] },
        {
          correctAnswer: 'ASDF',
          incorrectAnswers: ['ASDF', '1234', 'zxcv', 'ASDF'],
        },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: ['12324'] },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
      ];

      const expected =
        data.reduce(
          (acc, x) =>
            acc + x.incorrectAnswers.length + (x.correctAnswer ? 1 : 0),
          0
        ) / data.length;

      getPuzzlesForYear.mockResolvedValue(data);
      const result = await getAverageAttempts(2022);
      expect(result).toBe(expected);
    });
  });

  describe('getSolvedCount()', () => {
    test('returns 0 if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getSolvedCount(2022);
      expect(result).toBe(0);
    });

    test('returns 0 if no solved puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([
        { correctAnswer: null, incorrectAnswers: ['ASDF', '1234'] },
        { correctAnswer: null, incorrectAnswers: ['ASDF', 'asdf', 'zxcv'] },
        { correctAnswer: null, incorrectAnswers: ['ASDF'] },
      ]);
      const result = await getSolvedCount(2022);
      expect(result).toBe(0);
    });

    test('calculates solved count', async () => {
      const puzzles = [
        { correctAnswer: 'ASDF', incorrectAnswers: ['ASDF', '1234'] },
        { correctAnswer: null, incorrectAnswers: ['ASDF', 'asdf', 'zxcv'] },
        { correctAnswer: null, incorrectAnswers: ['ASDF'] },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
        { correctAnswer: 'ASDF', incorrectAnswers: [] },
      ];

      getPuzzlesForYear.mockResolvedValue(puzzles);
      const result = await getSolvedCount(2022);
      expect(result).toBe(puzzles.filter((x) => !!x.correctAnswer).length);
    });
  });

  describe('getPuzzleCompletionData()', () => {
    const mockPuzzle = (
      year,
      day,
      level,
      correctAnswer = '',
      incorrectAnswers = [],
      fastestRuntimeNs = null
    ) => ({
      id: `${year}${day}${level}`,
      year,
      day,
      level,
      correctAnswer,
      incorrectAnswers,
      fastestRuntimeNs,
    });

    test('returns empty array if no puzzles for year', async () => {
      getPuzzlesForYear.mockResolvedValue([]);
      const result = await getPuzzleCompletionData(2022);
      expect(result).toEqual([]);
    });

    test('returns each puzzle for year', async () => {
      const year = 2022;
      const expected = [
        mockPuzzle(year, 1, 1),
        mockPuzzle(year, 1, 2),
        mockPuzzle(year, 2, 1),
        mockPuzzle(year, 2, 2),
      ];
      getPuzzlesForYear.mockResolvedValue(expected);
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
      getPuzzlesForYear.mockResolvedValue(expected);
      const result = await getPuzzleCompletionData(year);
      expected.forEach((x, index) =>
        expect(result[index].solved).toBe(!!x.correctAnswer)
      );
    });

    test('only returns runtime if solved', async () => {
      const year = 2022;
      const puzzles = [
        mockPuzzle(year, 1, 1, 'ASDF', [], 1234),
        mockPuzzle(year, 1, 2, '1234', [], 5432),
        mockPuzzle(year, 2, 1, null, [], 1234),
        mockPuzzle(year, 2, 2),
      ];
      getPuzzlesForYear.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      puzzles.forEach((x, index) => {
        const expected = x.correctAnswer ? x.fastestRuntimeNs : null;
        expect(result[index].runtimeNs).toBe(expected);
      });
    });

    test('numberOfAttempts is 1 if solved with no wrong answers', async () => {
      const year = 2022;
      const puzzles = [mockPuzzle(year, 1, 1, 'ASDF', [], 1234)];
      getPuzzlesForYear.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(1);
    });

    test('numberOfAttempts is correct if solved with wrong answers', async () => {
      const year = 2022;
      const wrongAnswers = ['1234', 'sadf', 'zxcv', 'qwer'];
      const puzzles = [mockPuzzle(year, 1, 1, 'ASDF', wrongAnswers, 1234)];
      getPuzzlesForYear.mockResolvedValue(puzzles);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(wrongAnswers.length + 1);
    });

    test('numberOfAttempts is zero if unsolved and no wrong answers', async () => {
      const year = 2022;
      getPuzzlesForYear.mockResolvedValue([mockPuzzle(year, 1, 1)]);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(0);
    });

    test('numberOfAttempts is correct if unsolved with wrong answers', async () => {
      const year = 2022;
      const wrongAnswers = ['1234', 'sadf', 'zxcv', 'qwer', 'cvbx', 'rety'];
      getPuzzlesForYear.mockResolvedValue([
        mockPuzzle(year, 1, 1, null, wrongAnswers),
      ]);
      const result = await getPuzzleCompletionData(year);
      expect(result[0]?.numberOfAttempts).toBe(wrongAnswers.length);
    });

    test('sorts puzzles by id', async () => {
      const year = 2022;
      const input = [
        mockPuzzle(year, 6, 8),
        mockPuzzle(year, 4, 2),
        mockPuzzle(year, 4, 1),
        mockPuzzle(year, 2, 2),
        mockPuzzle(year, 1, 1),
      ];
      const expected = input.reverse().map(({ day, level }) => ({
        day,
        level,
        solved: false,
        runtimeNs: null,
        numberOfAttempts: 0,
      }));
      getPuzzlesForYear.mockResolvedValue(input);
      const result = await getPuzzleCompletionData(year);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('beatsFastestRuntime()', () => {
    test('returns false if puzzle not found', async () => {
      findPuzzle.mockResolvedValue(null);
      const result = await beatsFastestRuntime(1, 2, 3, 4);
      expect(result).toBe(false);
    });

    test('returns false if puzzle does not have fastest runtime set', async () => {
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: null });
      const result = await beatsFastestRuntime(1, 2, 3, 5);
      expect(result).toBe(false);
    });

    test('returns true if runtime is faster than fastest', async () => {
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: 100 });
      const result = await beatsFastestRuntime(1, 2, 3, 50);
      expect(result).toBe(true);
    });

    test('returns false if runtime is slower than fastest', async () => {
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: 100 });
      const result = await beatsFastestRuntime(1, 2, 3, 150);
      expect(result).toBe(false);
    });

    test('returns false if runtime is equal to fastest', async () => {
      findPuzzle.mockResolvedValue({ fastestRuntimeNs: 100 });
      const result = await beatsFastestRuntime(1, 2, 3, 100);
      expect(result).toBe(false);
    });
  });
});
