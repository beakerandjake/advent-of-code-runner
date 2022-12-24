import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ answerHasBeenSubmitted: jest.fn() }));

// import after mocks set up
const { answerHasBeenSubmitted } = await import('../../src/answers.js');
const { assertAnswerPreviouslySubmitted } = await import('../../src/actions/links/assertAnswerPreviouslySubmitted.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('assertAnswerPreviouslySubmitted()', () => {
      test.each([
        null, undefined,
      ])('throws if answer is %s', async (answer) => {
        await expect(async () => assertAnswerPreviouslySubmitted({
          year: 2022, day: 1, part: 5, answer,
        })).rejects.toThrow();
      });

      test('returns true if answer has been submitted', async () => {
        answerHasBeenSubmitted.mockResolvedValue(true);
        const result = await assertAnswerPreviouslySubmitted({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(true);
      });

      test('returns false if answer has not been submitted', async () => {
        answerHasBeenSubmitted.mockResolvedValue(false);
        const result = await assertAnswerPreviouslySubmitted({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(false);
      });
    });
  });
});
