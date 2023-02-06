import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig } from '../mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();

// import after mocks set up
const { assertConfigValue } = await import(
  '../../src/actions/assertConfigValue.js'
);

describe('assertInitialized()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([undefined, null, ''])('throws if key is: "%s"', async (key) => {
    expect(() => assertConfigValue(key)).toThrow();
  });

  test.each([true, {}, [], 1234, 'ASDF', new Date()])(
    'returns true if value is: "%s"',
    (value) => {
      const key = 'QWER';
      getConfigValue.mockImplementation((x) => {
        if (x === key) {
          return value;
        }
        throw new Error('unknown config key');
      });
      const result = assertConfigValue(key)();
      expect(result).toBe(true);
    }
  );

  test.each([false, 0, '', null, undefined, NaN])(
    'returns false if value is: "%s"',
    (value) => {
      const key = 'QWER';
      getConfigValue.mockImplementation((x) => {
        if (x === key) {
          return value;
        }
        throw new Error('unknown config key');
      });
      const result = assertConfigValue(key)();
      expect(result).toBe(false);
    }
  );
});
