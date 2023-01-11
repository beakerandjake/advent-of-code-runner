import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const mockChalk = { green: jest.fn((x) => x.toString()), yellow: jest.fn((x) => x?.toString() || '') };
jest.unstable_mockModule('chalk', () => ({ default: mockChalk }));
jest.unstable_mockModule('table', () => ({ table: jest.fn() }));
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
const { table } = await import('table');
const { getPuzzleCompletionData } = await import('../../src/statistics.js');
const { humanizeDuration } = await import('../../src/formatting.js');
const {
  outputCompletionTable,
  mapNamedColumn,
  mapSolvedColumn,
  mapAttemptColumns,
  mapRuntimeColumn,
  getSolvedMessage,
} = await import('../../src/actions/outputCompletionTable.js');

describe('actions', () => {
  describe('links', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('outputCompletionTable()', () => {
      test.each([
        null, undefined,
      ])('throws if year is: "%s"', async (year) => {
        await expect(async () => outputCompletionTable({ year })).rejects.toThrow();
      });

      test('halts chain if no completion data', async () => {
        getPuzzleCompletionData.mockResolvedValue([]);
        const result = await outputCompletionTable({ year: 2022 });
        expect(result).toBe(false);
      });

      test('does not generate table if no completion data', async () => {
        getPuzzleCompletionData.mockResolvedValue([]);
        await outputCompletionTable({ year: 2022 });
        expect(table).not.toHaveBeenCalled();
      });
    });

    describe('mapNamedColumn()', () => {
      test('colorizes if solved', () => {
        mapNamedColumn({ day: 1, part: 1, solved: true });
        expect(mockChalk.green).toHaveBeenCalled();
      });

      test('does not colorize if not solved', () => {
        mapNamedColumn({ day: 1, part: 1, solved: false });
        expect(mockChalk.green).not.toHaveBeenCalled();
      });
    });

    describe('mapSolvedColumn()', () => {
      test('colorizes if solved', () => {
        mapSolvedColumn({ solved: true });
        expect(mockChalk.green).toHaveBeenCalled();
      });

      test('does not colorize if not solved', () => {
        mapSolvedColumn({ solved: false });
        expect(mockChalk.green).not.toHaveBeenCalled();
      });
    });

    describe('mapAttemptColumns()', () => {
      test.each([
        null, undefined,
      ])('returns empty string if numberOfAttempts is: "%s"', (numberOfAttempts) => {
        const result = mapAttemptColumns([{ numberOfAttempts }]);
        expect(result[0]).toBe('');
      });

      test('does not highlight perfect solve if not solved', () => {
        const numberOfAttempts = 1;
        const result = mapAttemptColumns([{ numberOfAttempts, solved: false }]);
        expect(result[0]).toBe(numberOfAttempts.toString());
        expect(mockChalk.green).not.toHaveBeenCalled();
      });

      test('does not highlight perfect solve if too many attempts', () => {
        const numberOfAttempts = 10;
        const result = mapAttemptColumns([{ numberOfAttempts, solved: true }]);
        expect(result[0]).toBe(numberOfAttempts.toString());
        expect(mockChalk.green).not.toHaveBeenCalled();
      });

      test('highlights perfect solve', () => {
        const numberOfAttempts = 1;
        mockChalk.green.mockImplementation((x) => x.toString());
        const result = mapAttemptColumns([{ numberOfAttempts, solved: true }]);
        expect(mockChalk.green).toHaveBeenCalled();
        expect(result[0]).toBe(numberOfAttempts.toString());
      });

      test('does not highlight or mark worst if none match', () => {
        mockChalk.green.mockImplementation((x) => x.toString());
        const result = mapAttemptColumns([
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
        ], 5);
        expect(mockChalk.yellow).not.toHaveBeenCalled();
        result.forEach((x) => expect(x).not.toContain('worst'));
      });

      test('highlights each matching worst', () => {
        mockChalk.yellow.mockImplementation((x) => x.toString());
        mapAttemptColumns([
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
        ], 4);
        expect(mockChalk.yellow).toHaveBeenCalledTimes(3);
      });

      test('only marks first matching worst', () => {
        mockChalk.yellow.mockImplementation((x) => x.toString());
        const result = mapAttemptColumns([
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
        ], 4);
        const marked = result.filter((x) => x?.includes('worst'));
        expect(marked.length).toBe(1);
      });
    });

    describe('mapRuntimeColumn()', () => {
      test.each([
        null, undefined,
      ])('returns empty string if runtime is: "%s"', (runtime) => {
        const result = mapRuntimeColumn({ executionTimeNs: runtime });
        expect(result).toBe('');
      });

      test('returns value if no fastest or slowest', () => {
        humanizeDuration.mockImplementation((x) => x.toString());
        const executionTimeNs = 1234;
        const result = mapRuntimeColumn({ executionTimeNs });
        expect(result).toBe(executionTimeNs.toString());
      });

      test('does not highlight or mark if not fastest', () => {
        humanizeDuration.mockImplementation((x) => x.toString());
        const executionTimeNs = 1234;
        const result = mapRuntimeColumn({ executionTimeNs }, executionTimeNs - 10);
        expect(mockChalk.green).not.toHaveBeenCalled();
        expect(result).not.toContain('best');
      });

      test('highlight and marks if fastest', () => {
        humanizeDuration.mockImplementation((x) => x.toString());
        mockChalk.green.mockImplementation((x) => x.toString());
        const executionTimeNs = 1234;
        const result = mapRuntimeColumn({ executionTimeNs }, executionTimeNs);
        expect(mockChalk.green).toHaveBeenCalled();
        expect(result).toContain('best');
      });

      test('does not highlight or mark if not slowest', () => {
        humanizeDuration.mockImplementation((x) => x.toString());
        const executionTimeNs = 1234;
        const result = mapRuntimeColumn(
          { executionTimeNs },
          executionTimeNs - 10,
          executionTimeNs + 10,
        );
        expect(mockChalk.yellow).not.toHaveBeenCalled();
        expect(result).not.toContain('worst');
      });

      test('highlight and marks if slowest', () => {
        humanizeDuration.mockImplementation((x) => x.toString());
        mockChalk.yellow.mockImplementation((x) => x.toString());
        const executionTimeNs = 1234;
        const result = mapRuntimeColumn({ executionTimeNs }, executionTimeNs - 10, executionTimeNs);
        expect(mockChalk.yellow).toHaveBeenCalled();
        expect(result).toContain('worst');
      });
    });

    describe('getSolvedMessage()', () => {
      test.each([
        undefined, () => {}, Promise.resolve(10), NaN, Infinity,
      ])('throws if solved count is: "%s"', (solvedCount) => {
        expect(() => getSolvedMessage(solvedCount, 10)).toThrow();
      });

      test.each([
        undefined, () => {}, Promise.resolve(10), NaN,
      ])('throws if total count is: "%s"', (totalCount) => {
        expect(() => getSolvedMessage(10, totalCount)).toThrow();
      });

      test('handles divide by zero', () => {
        expect(() => getSolvedMessage(10, 0)).toThrow();
      });

      test('calculates percentage correctly', () => {
        const solved = 10;
        const total = 50;
        const expected = ((solved / total) * 100).toFixed();
        const result = getSolvedMessage(solved, total);
        expect(result).toContain(expected);
      });
    });
  });
});
