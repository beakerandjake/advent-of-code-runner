import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig } from './mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();
class Transport {}
jest.unstable_mockModule('winston-transport', () => ({ default: Transport }));
jest.unstable_mockModule('triple-beam', () => ({ LEVEL: 'level' }));

// import after mocks set up.
const { printFestiveTitle, makeFestive } = await import('../src/festive.js');

describe('formatting', () => {
  const consoleLog = console.log;

  afterEach(() => {
    jest.resetAllMocks();
    console.log = consoleLog;
  });

  describe('printFestiveTitle()', () => {
    test('does not print if suppressed via config', () => {
      getConfigValue.mockImplementation((key) => {
        if (key === 'cli.suppressTitleBox') {
          return true;
        }
        throw new Error('Unknown config key');
      });
      const mockLog = jest.fn();
      console.log = mockLog;
      printFestiveTitle();
      expect(mockLog).not.toHaveBeenCalled();
    });

    test('prints if not suppressed via config', () => {
      getConfigValue.mockImplementation((key) => {
        if (key === 'cli.suppressTitleBox') {
          return false;
        }
        throw new Error('Unknown config key');
      });
      const mockLog = jest.fn();
      console.log = mockLog;
      printFestiveTitle();
      expect(mockLog).toHaveBeenCalled();
    });
  });

  describe('makeFestive()', () => {
    test('does not add emojis if suppressed via config', () => {
      getConfigValue.mockImplementation((key) => {
        if (key === 'cli.suppressFestive') {
          return true;
        }
        throw new Error('Unknown config key');
      });
      const expected = 'ASDF';
      const result = makeFestive(expected);
      expect(result).toBe(expected);
    });

    test('adds emojis if not suppressed via config', () => {
      getConfigValue.mockImplementation((key) => {
        if (key === 'cli.suppressFestive') {
          return false;
        }
        throw new Error('Unknown config key');
      });
      const expected = 'ASDF';
      const result = makeFestive(expected);
      expect(result).toMatch(/.?\sASDF\s.?/);
    });
  });
});
