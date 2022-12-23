import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({
  addIncorrectAnswer: jest.fn(),
  setCorrectAnswer: jest.fn(),
}));

// import after mocks set up
const { addIncorrectAnswer, setCorrectAnswer } = await import('../../src/answers.js');
const { storeSubmissionResult } = await import('../../src/actions/links/storeSubmissionResult.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('storeSubmissionResult()', () => {
      test('sets correct answer if submission was correct', async () => {
        await storeSubmissionResult({
          year: 2022, day: 1, part: 1, answer: 'ASDF', submissionResult: { correct: true },
        });
        expect(setCorrectAnswer).toHaveBeenCalled();
        expect(addIncorrectAnswer).not.toHaveBeenCalled();
      });

      test('adds incorrect answer if submission was not correct', async () => {
        await storeSubmissionResult({
          year: 2022, day: 1, part: 1, answer: 'ASDF', submissionResult: { correct: false },
        });
        expect(setCorrectAnswer).not.toHaveBeenCalled();
        expect(addIncorrectAnswer).toHaveBeenCalled();
      });
    });
  });
});
