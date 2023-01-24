import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ answerHasBeenSubmitted: jest.fn() }));

// import after mocks set up
const { answerHasBeenSubmitted } = await import('../../src/answers.js');
const { assertAnswerNotPreviouslySubmitted } = await import('../../src/actions/assertAnswerNotPreviouslySubmitted.js');

describe('assertAnswerNotPreviouslySubmitted()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null, undefined,
  ])('throws if answer is %s', async (answer) => {
    await expect(async () => assertAnswerNotPreviouslySubmitted({
      year: 2022, day: 1, level: 5, answer,
    })).rejects.toThrow();
  });

  test('returns false if answer has been submitted', async () => {
    answerHasBeenSubmitted.mockResolvedValue(true);
    const result = await assertAnswerNotPreviouslySubmitted({
      year: 2022, day: 1, level: 1, answer: 'ASDF',
    });
    expect(result).toBe(false);
  });

  test('returns true if answer has not been submitted', async () => {
    answerHasBeenSubmitted.mockResolvedValue(false);
    const result = await assertAnswerNotPreviouslySubmitted({
      year: 2022, day: 1, level: 1, answer: 'ASDF',
    });
    expect(result).toBe(true);
  });
});
