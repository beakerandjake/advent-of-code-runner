import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/api/index.js', () => ({
  submitSolution: jest.fn(),
}));

// import after mocks set up
const { submitSolution } = await import('../../src/api/index.js');
const { submitPuzzleAnswer } = await import(
  '../../src/actions/submitPuzzleAnswer.js'
);

describe('submitPuzzleAnswer()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined])(
    'throws if auth token is: %s',
    async (authToken) => {
      await expect(async () =>
        submitPuzzleAnswer({
          year: 2022,
          day: 1,
          level: 1,
          answer: 'asdf',
          authToken,
        })
      ).rejects.toThrow();
    }
  );

  test.each([null, undefined])('throws if answer is: %s', async (answer) => {
    await expect(async () =>
      submitPuzzleAnswer({
        year: 2022,
        day: 1,
        level: 1,
        answer,
        authToken: 'SADF',
      })
    ).rejects.toThrow();
  });

  test('returns on answer correct', async () => {
    const apiResponse = { correct: true, message: 'great job!' };
    submitSolution.mockReturnValue(apiResponse);
    const result = await submitPuzzleAnswer({
      year: 2022,
      day: 1,
      level: 1,
      answer: 'ASDF',
      authToken: 'asdf',
    });
    expect(result).toEqual({ submissionResult: apiResponse });
  });

  test('returns on answer incorrect', async () => {
    const apiResponse = { correct: false, message: 'that is wrong!' };
    submitSolution.mockReturnValue(apiResponse);
    const result = await submitPuzzleAnswer({
      year: 2022,
      day: 1,
      level: 1,
      answer: 'ASDF',
      authToken: 'asdf',
    });
    expect(result).toEqual({ submissionResult: apiResponse });
  });
});
