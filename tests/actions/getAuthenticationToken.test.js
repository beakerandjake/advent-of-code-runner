import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();

// import after mocks set up
const { getAuthenticationToken } = await import('../../src/actions/getAuthenticationToken.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('getAuthenticationToken()', () => {
      test.each([
        undefined, null, '',
      ])('throws if token is value: "%s"', (token) => {
        getConfigValue.mockReturnValue(token);
        expect(() => getAuthenticationToken()).toThrow();
      });

      test('returns auth token', () => {
        const expected = 'ASDF';
        getConfigValue.mockReturnValue(expected);
        const result = getAuthenticationToken();
        expect(result).toEqual({ authToken: expected });
      });
    });
  });
});
