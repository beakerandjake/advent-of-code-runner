import { submitSolution } from '../../api/index.js';
import { logger } from '../../logger.js';

/**
 * Submit the answer to advent of code and returns the submission result.
 */
export const submitPuzzleAnswer = async ({
  year, day, part, answer, authToken,
} = {}) => {
  if (authToken == null) {
    throw new Error('null or undefined auth token');
  }
  if (answer == null) {
    throw new Error('null or undefined answer');
  }
  logger.festive('Submitting your answer to advent of code');
  const { correct, message } = await submitSolution(year, day, part, answer, authToken);
  logger[correct ? 'festive' : 'error'](message);
  return { submissionResult: { correct, message } };
};
