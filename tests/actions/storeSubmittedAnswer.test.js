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
const { storeSubmittedAnswer } = await import('../../src/actions/storeSubmittedAnswer.js');

describe('storeSubmittedAnswer()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null, undefined,
  ])('throws if answer is %s', async (answer) => {
    await expect(async () => storeSubmittedAnswer({
      year: 2022, day: 1, level: 1, answer, submissionResult: { success: true },
    })).rejects.toThrow();
  });

  test.each([
    null, undefined,
  ])('throws if submissionResult is %s', async (submissionResult) => {
    await expect(async () => storeSubmittedAnswer({
      year: 2022, day: 1, level: 1, answer: 'SADF', submissionResult,
    })).rejects.toThrow();
  });

  test.each([
    null, undefined,
  ])('throws if submissionResult.correct is %s', async (correct) => {
    await expect(async () => storeSubmittedAnswer({
      year: 2022, day: 1, level: 1, answer: 'SADF', submissionResult: { correct },
    })).rejects.toThrow();
  });

  test('sets correct answer if submission was correct', async () => {
    await storeSubmittedAnswer({
      year: 2022, day: 1, level: 1, answer: 'ASDF', submissionResult: { correct: true },
    });
    expect(setCorrectAnswer).toHaveBeenCalled();
    expect(addIncorrectAnswer).not.toHaveBeenCalled();
  });

  test('adds incorrect answer if submission was not correct', async () => {
    await storeSubmittedAnswer({
      year: 2022, day: 1, level: 1, answer: 'ASDF', submissionResult: { correct: false },
    });
    expect(setCorrectAnswer).not.toHaveBeenCalled();
    expect(addIncorrectAnswer).toHaveBeenCalled();
  });
});
