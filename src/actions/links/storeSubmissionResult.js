import { addIncorrectAnswer, setCorrectAnswer } from '../../answers.js';
import { logger } from '../../logger';

/**
 * Store the answer so it cannot be re-submitted to this puzzle in the future.
 */
export const storeSubmissionResult = async ({
  year, day, part, answer, submissionResult: { correct },
} = {}) => {
  if (correct) {
    logger.debug('storing correct answer: %s', answer);
    await setCorrectAnswer(year, day, part, answer);
  } else {
    logger.debug('storing incorrect answer: %s', answer);
    await addIncorrectAnswer(year, day, part, answer);
  }
};
