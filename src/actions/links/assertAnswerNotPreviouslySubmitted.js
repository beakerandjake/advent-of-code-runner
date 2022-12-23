import { logger } from '../../logger.js';
import { answerHasBeenSubmitted } from '../../answers.js';

/**
 * Halts execution if the puzzle has already been submitted to advent of code.
 */
export const assertAnswerNotPreviouslySubmitted = ({
  year, day, part, answer,
} = {}) => {
  // puzzle is unlocked if its not in the future.
  if (answerHasBeenSubmitted(year, day, part, answer)) {
    logger.error('You have already submitted this answer for this puzzle!');
    return false;
  }
  logger.debug('answer: %s has not been previously submitted', answer);
  return true;
};
