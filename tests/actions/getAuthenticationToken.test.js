import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();

// import after mocks set up
const { getAuthenticationToken } = await import('../../src/actions/common/getAuthenticationToken.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('common actions', () => {
  describe('getAuthenticationToken()', () => {
    test.each([
      undefined, null, '',
    ])('throws if token is value: "%s"', (token) => {
      getConfigValue.mockReturnValue(token);
      expect(() => getAuthenticationToken()).toThrow();
    });

    test('appends token to empty args', () => {
      const expected = 'ASDF';
      getConfigValue.mockReturnValue(expected);
      const result = getAuthenticationToken();
      expect(result).toEqual({ authToken: expected });
    });

    test('appends token to existing args', () => {
      const existing = { cats: true, dogs: false };
      const expected = { ...existing, authToken: 'SADF' };
      getConfigValue.mockReturnValue(expected.authToken);
      const result = getAuthenticationToken(existing);
      expect(result).toEqual(expected);
    });
  });
});
