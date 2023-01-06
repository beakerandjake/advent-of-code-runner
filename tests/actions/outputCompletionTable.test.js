import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/statistics.js', () => ({ getPuzzleCompletionData: jest.fn(), summarizeCompletionData: jest.fn() }));
jest.unstable_mockModule('src/tables/cliCompletionTable.js', () => ({ generateTable: jest.fn() }));

// import after mocks set up
const { getPuzzleCompletionData, summarizeCompletionData } = await import('../../src/statistics.js');
const { generateTable } = await import('../../src/tables/cliCompletionTable.js');
const { outputCompletionTable } = await import('../../src/actions/links/outputCompletionTable.js');

describe('actions', () => {
  describe('links', () => {
    describe('outputCompletionTable()', () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

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
        expect(generateTable).not.toHaveBeenCalled();
      });
    });
  });
});
