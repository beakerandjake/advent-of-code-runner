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
const { assertAnswerCorrect } = await import('../../src/actions/links/assertAnswerCorrect.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertAnswerCorrect()', () => {
      test('returns false if puzzle not solved', async () => {
        getCorrectAnswer.mockReturnValue(null);
        const result = await assertAnswerCorrect({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(false);
      });

      test('returns false answer does not equal correct answer', async () => {
        getCorrectAnswer.mockResolvedValue('ASDF');
        answersEqual.mockReturnValue(false);
        const result = await assertAnswerCorrect({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(false);
      });

      test('returns true if answer equals correct answer', async () => {
        getCorrectAnswer.mockResolvedValue('ASDF');
        answersEqual.mockReturnValue(true);
        const result = await assertAnswerCorrect({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(true);
      });
    });
  });
});