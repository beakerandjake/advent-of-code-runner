import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/config.js', () => ({ getConfigValue: jest.fn() }));
jest.unstable_mockModule('src/answers.js', () => ({ requiredPartsHaveBeenSolved: jest.fn() }));
jest.unstable_mockModule('src/validation/index.js', () => ({
  yearIsValid: jest.fn(),
  puzzleIsInFuture: jest.fn(),
}));

const { requiredPartsHaveBeenSolved } = await import('../../src/answers.js');
const { getConfigValue } = await import('../../src/config.js');
// import { humanizeDuration } from '../../formatting.js';
// import { getInput } from '../../inputs/index.js';
// import { logger } from '../../logger.js';
// import { executeUserSolution } from '../../solutions/index.js';
const { puzzleIsInFuture, yearIsValid } = await import('../../src/validation/index.js');
const { getYear, puzzleIsUnlocked } = await import('../../src/cli/actions/actionUtil.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('actionUtil', () => {
  describe('getYear()', () => {
    test('returns value if valid', () => {
      const expected = 2022;
      getConfigValue.mockReturnValue(expected);
      yearIsValid.mockReturnValue(true);
      expect(getYear()).toBe(expected);
    });

    test('throws if not valid', () => {
      yearIsValid.mockReturnValue(false);
      expect(() => getYear()).toThrow(RangeError);
    });
  });

  describe('puzzleIsUnlocked()', () => {
    test.each([
      [true, true, false],
      [true, false, false],
      [false, false, false],
      [false, true, true],
    ])('puzzle future: %s, required parts: %s returns: %s', async (future, required, expected) => {
      puzzleIsInFuture.mockReturnValue(future);
      requiredPartsHaveBeenSolved.mockReturnValue(required);
      const result = await puzzleIsUnlocked(2022, 1, 1);
      expect(result).toBe(expected);
    });
  });
});
