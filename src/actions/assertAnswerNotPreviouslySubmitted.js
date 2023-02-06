import { logger } from '../logger.js';
import { answerHasBeenSubmitted } from '../answers.js';

/**
 * Halts execution if the puzzle already been submitted to advent of code.
 */
export const assertAnswerNotPreviouslySubmitted = async ({
  year, day, level, answer,
} = {}) => {
  if (answer == null) {
    throw new Error('null or undefined answer');
  }

  if (await answerHasBeenSubmitted(year, day, level, answer)) {
    logger.error('You have already submitted this answer for this puzzle!');
    return false;
  }

  return true;
};
