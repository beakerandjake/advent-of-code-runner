import { addIncorrectAnswer, setCorrectAnswer } from '../../answers.js';
import { logger } from '../../logger.js';

/**
 * Store the answer (and its correctness) so it cannot be re-submitted to this puzzle in the future.
 */
export const storeSubmittedAnswer = async ({
  year, day, part, answer, submissionResult: { success },
} = {}) => {
  if (success) {
    logger.debug('storing correct answer: %s', answer);
    await setCorrectAnswer(year, day, part, answer);
  } else {
    logger.debug('storing incorrect answer: %s', answer);
    await addIncorrectAnswer(year, day, part, answer);
  }
};
