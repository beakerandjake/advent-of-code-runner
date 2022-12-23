import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({
  getCorrectAnswer: jest.fn(),
  answersEqual: jest.fn(),
}));

// import after mocks set up
const { getCorrectAnswer, answersEqual } = await import('../../src/answers.js');
const { assertAnswerStillCorrect } = await import('../../src/actions/links/assertAnswerStillCorrect.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertPuzzleIsUnlocked()', () => {
      test('returns false if puzzle not solved', async () => {
        getCorrectAnswer.mockReturnValue(null);
        const result = await assertAnswerStillCorrect({ year: 2022, day: 1 });
        expect(result).toBe(false);
      });

      test('returns false answer does not equal correct answer', async () => {
        getCorrectAnswer.mockResolvedValue('ASDF');
        answersEqual.mockReturnValue(false);
        const result = await assertAnswerStillCorrect({ year: 2022, day: 1 });
        expect(result).toBe(false);
      });

      test('returns true if answer equals correct answer', async () => {
        getCorrectAnswer.mockResolvedValue('ASDF');
        answersEqual.mockReturnValue(true);
        const result = await assertAnswerStillCorrect({ year: 2022, day: 1 });
        expect(result).toBe(true);
      });
    });
  });
});
