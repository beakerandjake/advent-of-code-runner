import { getYear } from './actionUtil.js';
import { getNextUnansweredPuzzle } from '../answers.js';
import { logger } from '../logger.js';
import { solvePuzzleAndSubmitAnswer } from './solvePuzzleAndSubmitAnswer.js';

/**
 * Finds and submits the next puzzle the user has not solved.
 */
export const autoSubmit = async () => {
  logger.festive('Finding next unsolved puzzle');
  const nextPuzzle = await getNextUnansweredPuzzle(getYear());

  // bail if all puzzles solved.
  if (!nextPuzzle) {
    logger.festive('You\'ve already solved all the puzzles for this year! If you want to submit a specific problem use the "submit" command instead.');
    return;
  }

  await solvePuzzleAndSubmitAnswer(nextPuzzle.day, nextPuzzle.part);
};
