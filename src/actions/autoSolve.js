import { getYear } from './actionUtil.js';
import { getNextUnansweredPuzzle } from '../answers.js';
import { logger } from '../logger.js';
import { solvePuzzle } from './solvePuzzle.js';

/**
 * Finds and solves the next puzzle the user has not solved.
 */
export const autoSolve = async () => {
  logger.festive('Finding next unsolved puzzle');
  const nextPuzzle = await getNextUnansweredPuzzle(getYear());

  // bail if all puzzles solved.
  if (!nextPuzzle) {
    logger.festive('You\'ve already solve all the puzzles for this year! If you want to solve a specific problem use the "solve" command instead.');
    return;
  }

  await solvePuzzle(nextPuzzle.day, nextPuzzle.part);
};
