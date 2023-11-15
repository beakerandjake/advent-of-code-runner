import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve } from './mocks.js';

// setup mocks
const terminalLink = jest.fn();
const easyMocks = [
  ['terminal-link', [['default', terminalLink]]],
  ['src//api/urls.js', ['puzzleBaseUrl']],
];
easyMock(easyMocks);

// import after mocks set up.
const { puzzleBaseUrl } = await easyResolve(easyMocks);
const {
  sizeOfStringInKb,
  betweenMessage,
  humanizeMinutesDifference,
  humanizeDuration,
  clickablePuzzleUrl,
} = await import('../src/formatting.js');

describe('formatting', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('sizeOfStringInKb()', () => {
    test.each([null, undefined])('throws if value is: "%s"', (value) => {
      expect(() => sizeOfStringInKb(value)).toThrow('null or undefined');
    });

    test.each([1234, {}])('throws if value is non-string: "%s"', (value) => {
      expect(() => sizeOfStringInKb(value)).toThrow(
        'type string or an instance of Buffer'
      );
    });

    test('returns expected value - empty string', () => {
      const result = sizeOfStringInKb('');
      expect(result).toBe('0kb');
    });

    test('returns expected value', () => {
      const string = 'A'.repeat(550);
      const result = sizeOfStringInKb(string);
      // assuming each character in string is 1 byte (since A is first 128 chars)
      expect(result).toBe('0.55kb');
    });
  });

  describe('betweenMessage()', () => {
    test('throws if choices is undefined', () => {
      expect(() => betweenMessage()).toThrow(RangeError);
    });

    test('throws if choices length is zero', () => {
      expect(() => betweenMessage([])).toThrow(RangeError);
    });

    test('throws if choices length is 1', () => {
      expect(() => betweenMessage([1])).toThrow(RangeError);
    });

    test('generates expected message', () => {
      const first = 1234;
      const last = 4321;
      const result = betweenMessage([first, 1, 2, 3, 4, 5, 6, 7, last]);
      expect(result).toBe(`between ${first} and ${last}`);
    });
  });

  describe('humanizeMinutesDifference()', () => {
    test('returns expected value - difference under a minute', () => {
      const start = new Date();
      // add 15 seconds
      const end = new Date(start.getTime() + 15000);
      const result = humanizeMinutesDifference(start, end);
      expect(result).toBe('15s');
    });

    test('returns expected value - difference under an hour', () => {
      const start = new Date();
      // add 15 minutes 22 seconds
      const end = new Date(start.getTime() + 22000 + 15 * 60000);
      const result = humanizeMinutesDifference(start, end);
      expect(result).toBe('15m 22s');
    });

    test('returns expected value - difference over an hour', () => {
      const start = new Date();
      // add 2 hours 15 minutes 16 seconds
      const end = new Date(start.getTime() + 16000 + 15 * 60000 + 120 * 60000);
      const result = humanizeMinutesDifference(start, end);
      expect(result).toBe('135m 16s');
    });
  });

  describe('humanizeDuration()', () => {
    test.each([null, undefined])(
      'throws if nanoseconds is: "%s"',
      (nanoseconds) => {
        expect(humanizeDuration(nanoseconds)).toBe('');
      }
    );

    test('returns expected value - seconds', () => {
      const nanoseconds = 4.2 * (1000 * 1000 * 1000);
      const result = humanizeDuration(nanoseconds);
      expect(result).toBe('4.2s');
    });

    test('returns expected value - milliseconds', () => {
      const nanoseconds = 96.27 * (1000 * 1000);
      const result = humanizeDuration(nanoseconds);
      expect(result).toBe('96.270ms');
    });

    test('returns expected value - microseconds', () => {
      const nanoseconds = 122.052 * 1000;
      const result = humanizeDuration(nanoseconds);
      expect(result).toBe('122.052μs');
    });

    test('returns expected value - nanoseconds', () => {
      const nanoseconds = 662;
      const result = humanizeDuration(nanoseconds);
      expect(result).toBe('662ns');
    });
  });

  describe('clickablePuzzleUrl()', () => {
    test('passes year and day to puzzleBaseUrl', () => {
      const year = 2022;
      const day = 14;
      clickablePuzzleUrl(year, day);
      expect(puzzleBaseUrl).toHaveBeenCalledWith(year, day);
    });

    test('passes puzzle url to terminal-link', () => {
      const url = 'cool.com';
      puzzleBaseUrl.mockReturnValue(url);
      clickablePuzzleUrl(2022, 11);
      expect(terminalLink).toHaveBeenCalledWith(expect.any(String), url);
    });
  });
});
