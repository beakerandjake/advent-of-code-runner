import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/api/index.js', () => ({ submitSolution: jest.fn() }));

// import after mocks set up
const { submitSolution } = await import('../../src/api/index.js');
const { submitPuzzleAnswer } = await import('../../src/actions/links/submitPuzzleAnswer.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('submitPuzzleAnswer()', () => {
      test('returns on answer correct', async () => {
        const apiResponse = { correct: true, message: 'great job!' };
        submitSolution.mockReturnValue(apiResponse);
        const result = await submitPuzzleAnswer({
          year: 2022, day: 1, part: 1, answer: 'ASDF', authenticationToken: 'asdf',
        });
        expect(result).toEqual({ submissionResult: apiResponse });
      });

      test('returns on answer incorrect', async () => {
        const apiResponse = { correct: false, message: 'that is wrong!' };
        submitSolution.mockReturnValue(apiResponse);
        const result = await submitPuzzleAnswer({
          year: 2022, day: 1, part: 1, answer: 'ASDF', authenticationToken: 'asdf',
        });
        expect(result).toEqual({ submissionResult: apiResponse });
      });
    });
  });
});
