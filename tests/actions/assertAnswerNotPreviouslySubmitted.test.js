import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ answerHasBeenSubmitted: jest.fn() }));

// import after mocks set up
const { answerHasBeenSubmitted } = await import('../../src/answers.js');
const { assertAnswerNotPreviouslySubmitted } = await import('../../src/actions/links/assertAnswerNotPreviouslySubmitted.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertAnswerNotPreviouslySubmitted()', () => {
      test('returns false answer has been submitted', async () => {
        answerHasBeenSubmitted.mockReturnValue(true);
        const result = await assertAnswerNotPreviouslySubmitted({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(false);
      });

      test('returns true answer has not been submitted', async () => {
        answerHasBeenSubmitted.mockReturnValue(false);
        const result = await assertAnswerNotPreviouslySubmitted({
          year: 2022, day: 1, part: 1, answer: 'ASDF',
        });
        expect(result).toBe(true);
      });
    });
  });
});
