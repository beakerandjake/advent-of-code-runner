import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// set up mocks
mockLogger();

jest.unstable_mockModule('../../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getConfigValue } = await import('../../src/config.js');
const { yearIsValid } = await import('../../src/validation/validateArgs.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('validateArgs', () => {
  describe('yearIsValid()', () => {
    test('true when year is valid', () => {
      const year = 2022;
      getConfigValue.mockReturnValue([1234, 9999, 2783, year, 3737]);
      expect(yearIsValid(year)).toBe(true);
    });

    test('false when year is not valid', () => {
      const year = 2022;
      getConfigValue.mockReturnValue([1234, 9999, 2783, 3737]);
      expect(yearIsValid(year)).toBe(false);
    });
  });

  test.todo('intParser');
});
