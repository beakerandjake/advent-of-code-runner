import { logger } from '../../logger.js';
import { answerHasBeenSubmitted } from '../../answers.js';

/**
 * Halts execution if the puzzle has not already been submitted to advent of code.
 */
export const assertAnswerPreviouslySubmitted = async ({
  year, day, part, answer,
} = {}) => {
  logger.verbose('checking if answer: "%s" has been previously submitted', answer);

  if (answer == null) {
    throw new Error('null or undefined answer');
  }

  if (await answerHasBeenSubmitted(year, day, part, answer)) {
    logger.error('You have already submitted this answer for this puzzle!');
    return true;
  }
  logger.verbose('answer has not been previously submitted');
  return false;
};
