import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('terminal-link', () => ({ default: jest.fn() }));
jest.unstable_mockModule('src/api/urls.js', () => ({ puzzleBaseUrl: jest.fn() }));

// import after setting up mocks
const { outputPuzzleLink } = await import('../../src/actions/outputPuzzleLink.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('outputPuzzleLink()', () => {
      test.each([
        null, undefined,
      ])('throws if year is %s', (year) => {
        expect(() => outputPuzzleLink({ year, day: 10, part: 10 })).toThrow();
      });

      test.each([
        null, undefined,
      ])('throws if day is %s', (day) => {
        expect(() => outputPuzzleLink({ year: 2022, day, part: 10 })).toThrow();
      });

      test.each([
        null, undefined,
      ])('throws if level is %s', (level) => {
        expect(() => outputPuzzleLink({ year: 2022, day: 10, level })).toThrow();
      });
    });
  });
});
