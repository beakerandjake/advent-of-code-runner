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
}));

jest.unstable_mockModule('src/validation/validationUtils.js', () => ({
  parsePositiveInt: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { addOrEditPuzzle, findPuzzle, createPuzzle } = await import('../src/persistence/puzzleRepository.js');
const { parsePositiveInt } = await import('../src/validation/validationUtils.js');
const { getFastestExecutionTime, setFastestExecutionTime } = await import('../src/statistics.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('statistics', () => {
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
});
