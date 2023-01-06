import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig } from '../mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();

// import after mocks setup
const { puzzleBaseUrl, puzzleAnswerUrl, puzzleInputUrl } = await import('../../src/api/urls.js');

describe('urls', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('puzzleBaseUrl()', () => {
    test.each([
      null, undefined,
    ])('throws if year is: "%s"', (year) => {
      expect(() => puzzleBaseUrl(year, 1)).toThrow();
    });

    test.each([
      null, undefined,
    ])('throws if day is: "%s"', (day) => {
      expect(() => puzzleBaseUrl(2022, day)).toThrow();
    });

    test('generates expected url', () => {
      const baseUrl = 'https://wikipedia.org';
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.baseUrl') {
          return baseUrl;
        }
        throw new Error('unexpected config key in test');
      });
      const year = 2020;
      const day = 5;
      const result = puzzleBaseUrl(year, day);
      expect(result).toBe(`${baseUrl}/${year}/day/${day}`);
    });
  });

  describe('puzzleAnswerUrl()', () => {
    test.each([
      null, undefined,
    ])('throws if year is: "%s"', (year) => {
      expect(() => puzzleAnswerUrl(year, 1)).toThrow();
    });

    test.each([
      null, undefined,
    ])('throws if day is: "%s"', (day) => {
      expect(() => puzzleAnswerUrl(2022, day)).toThrow();
    });

    test('generates expected url', () => {
      const baseUrl = 'https://wikipedia.org';
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.baseUrl') {
          return baseUrl;
        }
        throw new Error('unexpected config key in test');
      });
      const year = 2020;
      const day = 5;
      const result = puzzleAnswerUrl(year, day);
      expect(result).toBe(`${baseUrl}/${year}/day/${day}/answer`);
    });
  });

  describe('puzzleInputUrl()', () => {
    test.each([
      null, undefined,
    ])('throws if year is: "%s"', (year) => {
      expect(() => puzzleInputUrl(year, 1)).toThrow();
    });

    test.each([
      null, undefined,
    ])('throws if day is: "%s"', (day) => {
      expect(() => puzzleInputUrl(2022, day)).toThrow();
    });

    test('generates expected url', () => {
      const baseUrl = 'https://wikipedia.org';
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.baseUrl') {
          return baseUrl;
        }
        throw new Error('unexpected config key in test');
      });
      const year = 2020;
      const day = 5;
      const result = puzzleAnswerUrl(year, day);
      expect(result).toBe(`${baseUrl}/${year}/day/${day}/answer`);
    });
  });
});
