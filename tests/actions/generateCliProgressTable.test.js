import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const mockChalk = {
  green: jest.fn((x) => x.toString()),
  yellow: jest.fn((x) => x?.toString() || ''),
};
jest.unstable_mockModule('chalk', () => ({ default: mockChalk }));
jest.unstable_mockModule('table', () => ({ table: jest.fn() }));
jest.unstable_mockModule('src/formatting.js', () => ({
  humanizeDuration: jest.fn(),
}));
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({
  getTotalPuzzleCount: jest.fn(),
}));
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
const { humanizeDuration } = await import('../../src/formatting.js');
const { getTotalPuzzleCount } = await import(
  '../../src/validation/validatePuzzle.js'
);
const {
  getAverageAttempts,
  getSolvedCount,
  getMaxAttempts,
  getFastestRuntime,
  getSlowestRuntime,
  getAverageRuntime,
} = await import('../../src/statistics.js');
const {
  mapNamedColumn,
  mapSolvedColumn,
  mapAttemptColumns,
  mapRuntimeColumn,
  getAverageRow,
  getSolvedRow,
  generatePuzzleRows,
  generateCliProgressTable,
} = await import('../../src/actions/generateCliProgressTable.js');

describe('generateCliProgressTable()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([undefined, null, ''])('throws if year is: "%s"', async (year) => {
    await expect(async () =>
      generateCliProgressTable({ year, completionData: [1234] })
    ).rejects.toThrow();
  });

  test.each([undefined, null, []])(
    'throws if completion data is: "%s"',
    async (completionData) => {
      await expect(async () =>
        generateCliProgressTable({ year: 2023, completionData })
      ).rejects.toThrow();
    }
  );

  test('passes expected data to table()', async () => {
    const completionData = [
      {
        day: 1,
        level: 1,
        solved: false,
        runtimeNs: 1234,
        numberOfAttempts: 6,
      },
    ];
    mockChalk.green.mockImplementation((x) => x?.toString() || '');
    mockChalk.yellow.mockImplementation((x) => x?.toString() || '');
    getSolvedCount.mockResolvedValue(123);
    getTotalPuzzleCount.mockReturnValue(1234);
    getAverageAttempts.mockResolvedValue(22.23344555);
    getAverageRuntime.mockResolvedValue('432ms');
    humanizeDuration.mockImplementation((x) => x?.toString() || '');

    await generateCliProgressTable({ year: 2023, completionData });

    expect(table).toHaveBeenCalledWith(
      [
        ['Advent of Code 2023', '', '', ''],
        ['Puzzle', 'Solved', 'Attempts', 'Runtime'],
        ['1.1', '', '6', '1234'],
        ['Average', '', '22.23', '432ms'],
        ['Solved 123/1234 (10%)', '', '', ''],
      ],
      expect.anything()
    );
  });

  describe('mapNamedColumn()', () => {
    test('colorizes if solved', () => {
      mapNamedColumn({ day: 1, level: 1, solved: true });
      expect(mockChalk.green).toHaveBeenCalled();
    });

    test('does not colorize if not solved', () => {
      mapNamedColumn({ day: 1, level: 1, solved: false });
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
    test.each([null, undefined])(
      'returns empty string if numberOfAttempts is: "%s"',
      (numberOfAttempts) => {
        const result = mapAttemptColumns([{ numberOfAttempts }]);
        expect(result[0]).toBe('');
      }
    );

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
      const result = mapAttemptColumns(
        [
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
        ],
        5
      );
      expect(mockChalk.yellow).not.toHaveBeenCalled();
      result.forEach((x) => expect(x).not.toContain('worst'));
    });

    test('highlights each matching worst', () => {
      mockChalk.yellow.mockImplementation((x) => x.toString());
      mapAttemptColumns(
        [
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
        ],
        4
      );
      expect(mockChalk.yellow).toHaveBeenCalledTimes(3);
    });

    test('only marks first matching worst', () => {
      mockChalk.yellow.mockImplementation((x) => x.toString());
      const result = mapAttemptColumns(
        [
          { numberOfAttempts: 1, solved: true },
          { numberOfAttempts: 2, solved: true },
          { numberOfAttempts: 3, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
          { numberOfAttempts: 4, solved: true },
        ],
        4
      );
      const marked = result.filter((x) => x?.includes('worst'));
      expect(marked.length).toBe(1);
    });
  });

  describe('mapRuntimeColumn()', () => {
    test.each([null, undefined])(
      'returns empty string if runtime is: "%s"',
      (runtimeNs) => {
        const result = mapRuntimeColumn({ runtimeNs });
        expect(result).toBe('');
      }
    );

    test('returns value if no fastest or slowest', () => {
      humanizeDuration.mockImplementation((x) => x.toString());
      const runtimeNs = 1234;
      const result = mapRuntimeColumn({ runtimeNs });
      expect(result).toBe(runtimeNs.toString());
    });

    test('does not highlight or mark if not fastest', () => {
      humanizeDuration.mockImplementation((x) => x.toString());
      const runtimeNs = 1234;
      const result = mapRuntimeColumn({ runtimeNs }, runtimeNs - 10);
      expect(mockChalk.green).not.toHaveBeenCalled();
      expect(result).not.toContain('best');
    });

    test('highlight and marks if fastest', () => {
      humanizeDuration.mockImplementation((x) => x.toString());
      mockChalk.green.mockImplementation((x) => x.toString());
      const runtimeNs = 1234;
      const result = mapRuntimeColumn({ runtimeNs }, runtimeNs);
      expect(mockChalk.green).toHaveBeenCalled();
      expect(result).toContain('best');
    });

    test('does not highlight or mark if not slowest', () => {
      humanizeDuration.mockImplementation((x) => x.toString());
      const runtimeNs = 1234;
      const result = mapRuntimeColumn(
        { runtimeNs },
        runtimeNs - 10,
        runtimeNs + 10
      );
      expect(mockChalk.yellow).not.toHaveBeenCalled();
      expect(result).not.toContain('worst');
    });

    test('highlight and marks if slowest', () => {
      humanizeDuration.mockImplementation((x) => x.toString());
      mockChalk.yellow.mockImplementation((x) => x.toString());
      const runtimeNs = 1234;
      const result = mapRuntimeColumn({ runtimeNs }, runtimeNs - 10, runtimeNs);
      expect(mockChalk.yellow).toHaveBeenCalled();
      expect(result).toContain('worst');
    });
  });

  describe('getSolvedRow()', () => {
    test.each([undefined, () => {}, Promise.resolve(10), NaN, Infinity])(
      'throws if solved count is: "%s"',
      async (solvedCount) => {
        getSolvedCount.mockResolvedValue(solvedCount);
        await expect(async () =>
          getSolvedRow({ year: 2022 })
        ).rejects.toThrow();
      }
    );

    test.each([undefined, () => {}, Promise.resolve(10), NaN])(
      'throws if total count is: "%s"',
      async (totalCount) => {
        getSolvedCount.mockResolvedValue(12);
        getTotalPuzzleCount.mockReturnValue(totalCount);
        await expect(async () =>
          getSolvedRow({ year: 2022 })
        ).rejects.toThrow();
      }
    );

    test('handles divide by zero', async () => {
      getSolvedCount.mockResolvedValue(12);
      getTotalPuzzleCount.mockReturnValue(0);
      await expect(async () => getSolvedRow({ year: 2022 })).rejects.toThrow();
    });

    test('returns expected value', async () => {
      const solved = 10;
      const total = 50;
      const expectedPercent = ((solved / total) * 100).toFixed();
      getSolvedCount.mockResolvedValue(solved);
      getTotalPuzzleCount.mockReturnValue(total);

      const result = await getSolvedRow({ year: 2023 });
      expect(result).toEqual([
        `Solved ${solved}/${total} (${expectedPercent}%)`,
        '',
        '',
        '',
      ]);
    });
  });

  describe('getAverageRow()', () => {
    test('generates expected value', async () => {
      getAverageAttempts.mockResolvedValue(22.23344555);
      humanizeDuration.mockReturnValue('775.37ms');
      const result = await getAverageRow(2022);
      expect(result).toEqual(['Average', '', '22.23', '775.37ms']);
    });
  });

  describe('generatePuzzleRows()', () => {
    test('does not mark best/worst if less than 2 rows', async () => {
      mockChalk.green.mockImplementation((x) => x?.toString() || '');
      humanizeDuration.mockImplementation((x) => x?.toString() || '');
      const result = await generatePuzzleRows(2022, [
        {
          day: 1,
          level: 1,
          solved: false,
          runtimeNs: 1234,
          numberOfAttempts: 6,
        },
        {
          day: 1,
          level: 2,
          solved: true,
          runtimeNs: 4321,
          numberOfAttempts: 4,
        },
      ]);
      expect(result).toEqual([
        ['1.1', '', '6', '1234'],
        ['1.2', '✓', '4', '4321'],
      ]);
    });

    test('marks best/worst if more than 2 rows', async () => {
      const completionData = [
        {
          day: 1,
          level: 1,
          solved: false,
          runtimeNs: 1234,
          numberOfAttempts: 6,
        },
        {
          day: 1,
          level: 2,
          solved: true,
          runtimeNs: 4321,
          numberOfAttempts: 4,
        },
        {
          day: 2,
          level: 1,
          solved: false,
          runtimeNs: 661,
          numberOfAttempts: 1,
        },
      ];
      mockChalk.green.mockImplementation((x) => x?.toString() || '');
      mockChalk.yellow.mockImplementation((x) => x?.toString() || '');
      getMaxAttempts.mockResolvedValue(6);
      getFastestRuntime.mockResolvedValue(661);
      getSlowestRuntime.mockResolvedValue(4321);
      humanizeDuration.mockImplementation((x) => x?.toString() || '');
      const result = await generatePuzzleRows(2022, completionData);

      expect(result).toEqual([
        ['1.1', '', '6 (worst)', '1234'],
        ['1.2', '✓', '4', '4321 (worst)'],
        ['2.1', '', '1', '661 (best)'],
      ]);
    });
  });
});
