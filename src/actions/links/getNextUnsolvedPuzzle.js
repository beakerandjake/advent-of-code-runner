import { getNextUnansweredPuzzle } from '../../answers.js';
import { logger } from '../../logger.js';

/**
 * Finds and returns the next puzzle the user has not successfully solved.
 * If the user has solved all of the puzzles this year, halts the chain.
 */
export const getNextUnsolvedPuzzle = async ({ year } = {}) => {
  const nextPuzzle = await getNextUnansweredPuzzle(year);
  if (!nextPuzzle) {
    logger.festive('Congratulations, you\'ve already solved all the puzzles for this year! If you want to solve a specific puzzle use the "solve" command instead.');
    return false;
  }

  const { day, part } = nextPuzzle;
  logger.festive(`Your next unsolved puzzle is (day: ${day}, level: ${part}`);
  return { day, part };
};
