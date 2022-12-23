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
