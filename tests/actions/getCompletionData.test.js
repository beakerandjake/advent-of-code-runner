import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/statistics.js', () => ({
  getPuzzleCompletionData: jest.fn(),
}));

// import after mocks set up
const { getPuzzleCompletionData } = await import('../../src/statistics.js');
const { getCompletionData } = await import(
  '../../src/actions/getCompletionData.js'
);

describe('getCompletionData()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([undefined, null, ''])('throws if year is: "%s"', async (year) => {
    await expect(async () => getCompletionData({ year })).rejects.toThrow();
  });

  test('halts chain if no completion data', async () => {
    getPuzzleCompletionData.mockResolvedValue([]);
    const result = await getCompletionData({ year: 2023 });
    expect(result).toBe(false);
  });

  test('returns completion data', async () => {
    const expected = ['ASDF', 'QWER'];
    getPuzzleCompletionData.mockResolvedValue(expected);
    const result = await getCompletionData({ year: 2023 });
    expect(result).toEqual({ completionData: expected });
  });
});
