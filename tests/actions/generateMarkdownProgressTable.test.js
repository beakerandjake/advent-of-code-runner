import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/formatting.js', () => ({ humanizeDuration: jest.fn() }));
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({ getTotalPuzzleCount: jest.fn() }));
jest.unstable_mockModule('src/statistics.js', () => ({
  getAverageAttempts: jest.fn(),
  getAverageRuntime: jest.fn(),
  getFastestRuntime: jest.fn(),
  getMaxAttempts: jest.fn(),
  getPuzzleCompletionData: jest.fn(),
  getSlowestRuntime: jest.fn(),
  getSolvedCount: jest.fn(),
}));

// import after mocks set up
const { humanizeDuration } = await import('../../src/formatting.js');
const { getSolvedCount } = await import('../../src/statistics.js');
const { getTotalPuzzleCount } = await import('../../src/validation/validatePuzzle.js');
const {
  tr,
  italic,
  bold,
  mapNameColumn,
  mapSolvedColumn,
  mapAttemptColumns,
  mapRuntimeColumn,
  generateHeader,
  generateMarkdownProgressTable,
} = await import('../../src/actions/generateMarkdownProgressTable.js');

describe('getCompletionData()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    undefined, null, '',
  ])('throws if year is: "%s"', async (year) => {
    await expect(
      async () => generateMarkdownProgressTable({ year, completionData: [1234] }),
    ).rejects.toThrow();
  });

  test.each([
    undefined, null, [],
  ])('throws if completion data is: "%s"', async (completionData) => {
    await expect(
      async () => generateMarkdownProgressTable({ year: 2023, completionData }),
    ).rejects.toThrow();
  });

  describe('tr()', () => {
    test('joins values', () => {
      const values = ['ASDF', '1234', 'ASDF'];
      const result = tr(values);
      expect(result).toContain(values.join(' | '));
    });

    test('adds leading and trailing pipes', () => {
      const result = tr(['asdf', '1234']);
      expect(result.startsWith('| ')).toBe(true);
      expect(result.endsWith(' |')).toBe(true);
    });
  });

  describe('italic()', () => {
    test('generates correct markdown', () => {
      const input = 'ASDF';
      const result = italic(input);
      expect(result).toBe(`*${input}*`);
    });
  });

  describe('bold()', () => {
    test('generates correct markdown', () => {
      const input = 'ASDF';
      const result = bold(input);
      expect(result).toBe(`**${input}**`);
    });
  });

  describe('mapNamedColumn()', () => {
    test('outputs expected value', () => {
      const input = { day: 10, level: 11 };
      const result = mapNameColumn(input);
      expect(result).toBe([input.day, input.level].join('.'));
    });
  });

  describe('mapSolvedColumn()', () => {
    test('returns empty on not solved', () => {
      const input = { solved: false };
      const result = mapSolvedColumn(input);
      expect(result).toBe('');
    });

    test('returns value on solved', () => {
      const input = { solved: true };
      const result = mapSolvedColumn(input);
      expect(result).not.toBe('');
    });
  });

  describe('mapAttemptColumns()', () => {
    test.each([
      null, undefined,
    ])('returns empty string if provided: "%s"', (numberOfAttempts) => {
      const input = [{ numberOfAttempts }];
      const result = mapAttemptColumns(input);
      expect(result).toEqual(['']);
    });

    test('returns value if no max attempts', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input);
      expect(result).toEqual(input.map((x) => x.numberOfAttempts.toString()));
    });

    test('returns value if max attempt not equal to value', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input, 445);
      expect(result).toEqual(input.map((x) => x.numberOfAttempts.toString()));
    });

    test('appends (worst) if value equal to max attempt', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input, input[0].numberOfAttempts);
      expect(result[0]).toContain('(worst)');
    });
  });

  describe('mapRuntimeColumn()', () => {
    test.each([
      null, undefined,
    ])('returns empty string if provided: "%s"', (numberOfAttempts) => {
      const input = { numberOfAttempts };
      const result = mapRuntimeColumn(input);
      expect(result).toEqual('');
    });

    test('returns value if no fastest or slowest provided', () => {
      const expected = 'ASDF';
      humanizeDuration.mockReturnValue(expected);
      const input = { runtimeNs: 10 };
      const result = mapRuntimeColumn(input);
      expect(result).toBe(expected);
    });

    test('returns value if not equal to fastest or slowest', () => {
      const expected = 'ASDF';
      humanizeDuration.mockReturnValue(expected);
      const input = { runtimeNs: 10 };
      const result = mapRuntimeColumn(input, input.runtimeNs - 4, input.runtimeNs + 5);
      expect(result).toBe(expected);
    });

    test('appends (best) if value is equal to fastest', () => {
      const input = { runtimeNs: 10 };
      const result = mapRuntimeColumn(input, input.runtimeNs, input.runtimeNs + 5);
      expect(result).toContain('best');
    });

    test('appends (worst) if value is equal to slowest', () => {
      const input = { runtimeNs: 10 };
      const result = mapRuntimeColumn(input, input.runtimeNs - 3, input.runtimeNs);
      expect(result).toContain('worst');
    });
  });

  describe('generateHeader()', () => {
    test('throws if solved count is non numeric', async () => {
      getSolvedCount.mockResolvedValue('ASDF');
      await expect(async () => generateHeader(2022)).rejects.toThrow();
    });

    test('throws if total puzzle count is non numeric', async () => {
      getSolvedCount.mockResolvedValue(123);
      getTotalPuzzleCount.mockReturnValue('ASDF');
      await expect(async () => generateHeader(2022)).rejects.toThrow();
    });

    test('handles divide by zero', async () => {
      getSolvedCount.mockResolvedValue(123);
      getTotalPuzzleCount.mockReturnValue(0);
      await expect(async () => generateHeader(2022)).rejects.toThrow();
    });

    test('calculates percent correctly', async () => {
      const solvedCount = 10;
      const totalPuzzleCount = 522;
      getSolvedCount.mockResolvedValue(solvedCount);
      getTotalPuzzleCount.mockReturnValue(totalPuzzleCount);
      const result = await generateHeader(2022);
      expect(result).toContain(((solvedCount / totalPuzzleCount) * 100).toFixed());
    });
  });
});