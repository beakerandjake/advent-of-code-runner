import { getCorrectAnswer, answersEqual } from '../../answers.js';
import { logger } from '../../logger.js';

/**
 * Compares the answer to the *previously* solved and stored answer
 * Returns true only if the values are equal.
 * Returns false if the puzzle has not been solved or the values are not equal
 */
export const assertAnswerCorrect = async ({
  year, day, part, answer,
} = {}) => {
  const correctAnswer = await getCorrectAnswer(year, day, part);

  // if there isn't a correct answer stored, then this puzzle hasn't been solved.
  if (!correctAnswer) {
    logger.debug('could not find a stored correct answer for this puzzle');
    return false;
  }

  if (!answersEqual(answer, correctAnswer)) {
    // the user might have already submitted the correct answer to this problem
    // but are re-executing their solution because they made code or performance improvements.
    // let them know their changes might have broke something.
    logger.error('You have already correctly answered this puzzle, but answer: "%s" doesn\'t match correct answer: "%s"', answer, correctAnswer);
    return false;
  }

  logger.debug('answer: %s matches correct answer: %s', answer, correctAnswer);
  return true;
};
