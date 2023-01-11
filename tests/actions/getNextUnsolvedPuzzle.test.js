import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ getNextUnansweredPuzzle: jest.fn() }));

// import after mocks set up
const { getNextUnansweredPuzzle } = await import('../../src/answers.js');
const { getNextUnsolvedPuzzle } = await import('../../src/actions/getNextUnsolvedPuzzle.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('getNextUnsolvedPuzzle()', () => {
      test('halts chain if all puzzles answered', async () => {
        getNextUnansweredPuzzle.mockResolvedValue(null);
        const result = await getNextUnsolvedPuzzle({ year: 2022 });
        expect(result).toBe(false);
      });

      test('returns next unanswered puzzle', async () => {
        const expected = { day: 1, part: 20 };
        getNextUnansweredPuzzle.mockResolvedValue(expected);
        const result = await getNextUnsolvedPuzzle({ year: 2022 });
        expect(result).toEqual(expected);
      });
    });
  });
});
