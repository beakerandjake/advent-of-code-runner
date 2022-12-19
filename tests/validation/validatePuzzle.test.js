import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// set up mocks
mockLogger();

jest.unstable_mockModule('../../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getConfigValue } = await import('../../src/config.js');
const { getAllPuzzlesForYear } = await import('../../src/validation/validatePuzzle.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('validatePuzzle', () => {
  describe('getAllPuzzlesForYear()', () => {
    test('returns expected value', () => {
      const year = 2022;
      getConfigValue.mockReturnValueOnce([1, 2, 3, 4, 5]);
      getConfigValue.mockReturnValueOnce([1, 2, 3]);
      const expected = [
        { year, day: 1, part: 1 },
        { year, day: 1, part: 2 },
        { year, day: 1, part: 3 },
        { year, day: 2, part: 1 },
        { year, day: 2, part: 2 },
        { year, day: 2, part: 3 },
        { year, day: 3, part: 1 },
        { year, day: 3, part: 2 },
        { year, day: 3, part: 3 },
        { year, day: 4, part: 1 },
        { year, day: 4, part: 2 },
        { year, day: 4, part: 3 },
        { year, day: 5, part: 1 },
        { year, day: 5, part: 2 },
        { year, day: 5, part: 3 },
      ];

      expect(getAllPuzzlesForYear(year)).toStrictEqual(expected);
    });
  });
});
