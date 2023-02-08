import { describe, jest, test, afterEach } from '@jest/globals';
import { mockCommander, mockConfig } from '../mocks.js';

// setup mocks
mockCommander();
mockConfig();
jest.unstable_mockModule('src/formatting.js', () => ({
  betweenMessage: jest.fn(),
}));
jest.unstable_mockModule('src/validation/index.js', () => ({
  dayIsValid: jest.fn(),
  levelIsValid: jest.fn(),
  parsePositiveInt: jest.fn(),
}));
jest.unstable_mockModule('node:process', () => ({ exit: jest.fn() }));

// import after mocks set up.
const { parsePositiveInt } = await import('../../src/validation/index.js');
const { parseArgument } = await import('../../src/cli/arguments.js');

describe('arguments', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('parseArgument()', () => {
    test('throws if validationFn throws', () => {
      const validationFn = () => {
        throw new Error();
      };
      expect(() => parseArgument('ASDF', validationFn, 'ASDF')).toThrow();
    });

    test('throws if validationFn returns false', () => {
      const message = 'ASDFSADF';
      expect(() => parseArgument('ASDF', () => false, message)).toThrow(message);
    });

    test('returns parsed value if validationFn returns true', () => {
      const expected = 1243;
      parsePositiveInt.mockReturnValue(expected);
      const result = parseArgument('ASDF', () => true, 'FDSA');
      expect(result).toBe(expected);
    });
  });
});
