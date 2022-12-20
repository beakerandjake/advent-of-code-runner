import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/config.js', () => ({ getConfigValue: jest.fn() }));
jest.unstable_mockModule('src/validation/index.js', () => ({
  yearIsValid: jest.fn(),
  puzzleIsInFuture: jest.fn(),
}));

// import { requiredPartsHaveBeenSolved } from '../../answers.js';
const { getConfigValue } = await import('../../src/config.js');
// import { humanizeDuration } from '../../formatting.js';
// import { getInput } from '../../inputs/index.js';
// import { logger } from '../../logger.js';
// import { executeUserSolution } from '../../solutions/index.js';
const { puzzleIsInFuture, yearIsValid } = await import('../../src/validation/index.js');
const { getYear } = await import('../../src/cli/actions/actionUtil.js');

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
});
