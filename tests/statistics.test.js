import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from './mocks.js';

// import { logger } from './logger.js';
// import { addOrEditPuzzle, findPuzzle } from './persistence/puzzleRepository.js';

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
const { tryToSetFastestExecutionTime, getFastestExecutionTime, setFastestExecutionTime } = await import('../src/statistics.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('statistics', () => {
  describe('tryToSetFastestExecutionTime()', () => {
    test('throws if time is null', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, null); })
        .rejects
        .toThrow();
    });

    test('throws if time is undefined', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, undefined); })
        .rejects
        .toThrow();
    });

    test('throws if time is non numeric', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, false); })
        .rejects
        .toThrow();
    });

    test('throws if time is NaN', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, Infinity); })
        .rejects
        .toThrow();
    });

    test('throws if time is zero', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, 0); })
        .rejects
        .toThrow();
    });

    test('throws if time is negative', async () => {
      expect(async () => { await tryToSetFastestExecutionTime(2022, 1, 1, -1234); })
        .rejects
        .toThrow();
    });

    test('noop on puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      await tryToSetFastestExecutionTime(2022, 1, 1, 12341234);
      expect(addOrEditPuzzle).not.toBeCalled();
    });

    test('doest not update if time is not faster than record', async () => {
      findPuzzle.mockReturnValueOnce({ fastestExecutionTimeNs: 55 });
      await tryToSetFastestExecutionTime(2022, 1, 1, 12341234);
      expect(addOrEditPuzzle).not.toBeCalled();
    });

    test('updates if time is faster than record', async () => {
      findPuzzle.mockReturnValueOnce({ fastestExecutionTimeNs: 1234231432314 });
      await tryToSetFastestExecutionTime(2022, 1, 1, 22);
      expect(addOrEditPuzzle).toBeCalled();
    });

    test('updates if record time is null', async () => {
      findPuzzle.mockReturnValueOnce({ fastestExecutionTimeNs: null });
      await tryToSetFastestExecutionTime(2022, 1, 1, 22);
      expect(addOrEditPuzzle).toBeCalled();
    });
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

  // test('throws if value is not positive int', async () => {
  //   parsePositiveInt.mockReturnValue(false);
  //   await expect(async () => getFastestExecutionTime(2022, 1, 1)).rejects.toThrow();
  // });
});
