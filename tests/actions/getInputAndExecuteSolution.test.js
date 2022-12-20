import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/actions/getPuzzleInput.js', () => ({ getPuzzleInput: jest.fn() }));
jest.unstable_mockModule('src/solutions/index.js', () => ({ executeUserSolution: jest.fn() }));
jest.unstable_mockModule('src/formatting.js', () => ({ humanizeDuration: jest.fn() }));

// import after mocks set up
const { getPuzzleInput } = await import('../../src/actions/getPuzzleInput.js');
const { executeUserSolution } = await import('../../src/solutions/index.js');
const { getInputAndExecuteSolution } = await import('../../src/actions/getInputAndExecuteSolution.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('actions', () => {
  describe('executeUserSolution()', () => {
    test('throws if getPuzzleInput() throws', async () => {
      getPuzzleInput.mockRejectedValue(new Error());
      await expect(async () => getInputAndExecuteSolution(1, 2)).rejects.toThrow();
    });

    test('calls executeUserSolution()', async () => {
      const day = 1;
      const part = 2;
      const input = 'ASDF';
      getPuzzleInput.mockResolvedValue(input);
      executeUserSolution.mockResolvedValue({});
      await getInputAndExecuteSolution(day, part);
      expect(executeUserSolution).toHaveBeenCalledWith(day, part, input);
    });

    test('returns results from executeUserSolution()', async () => {
      const expected = { answer: 'cats', executionTimeNs: 1234 };
      getPuzzleInput.mockResolvedValue('ASDF');
      executeUserSolution.mockResolvedValue(expected);
      const result = await getInputAndExecuteSolution(1, 2);
      expect(result).toEqual(expected);
    });
  });
});
