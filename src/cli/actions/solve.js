import { PuzzleIsLockedError } from '../../errors/validationErrors.js';
import { logger } from '../../logger.js';
import { puzzleIsUnlocked } from '../../validation/validatePuzzle.js';
import { getYear } from './actionUtil.js';

/**
 * Solves a specific puzzle
 */
export const solve = async (day, part) => {
  logger.festive('Solving puzzle for day: %s, part: %s', day, part);
  const year = getYear();
  // don't allow solve future puzzles.
  if (!puzzleIsUnlocked(year, day)) {
    throw new PuzzleIsLockedError(day, part);
  }
};
