import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// import { logger } from './logger.js';
// import { addOrEditPuzzle, findPuzzle } from './persistence/puzzleRepository.js';

// setup mocks.
jest.unstable_mockModule('../src/persistence/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
  addOrEditPuzzle: jest.fn(),
}));

jest.unstable_mockModule('../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    festive: jest.fn(),
  },
}));

// import after setting up the mock so the modules import the mocked version
const { tryToSetFastestExecutionTime } = await import('../src/statistics.js');
const { addOrEditPuzzle, findPuzzle } = await import('../src/persistence/puzzleRepository.js');

afterEach(() => {
  jest.clearAllMocks();
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
});
