import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
jest.unstable_mockModule('node:process', () => ({ exit: jest.fn() }));

// import after mocks set up.
const { exit } = await import('node:process');
const { commanderErrorCodes, exitOverride } = await import(
  '../../src/cli/exitOverride.js'
);

describe('exitOverride()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each(commanderErrorCodes)('exits on error code: "%s"', (code) => {
    try {
      exitOverride({ code });
    } catch {
      // swallow the error.. the code will always throw since exit is a mock.
    } finally {
      expect(exit).toHaveBeenCalled();
    }
  });

  test('throws on unknown error code', () => {
    expect(() => exitOverride(new Error())).toThrow();
  });
});
