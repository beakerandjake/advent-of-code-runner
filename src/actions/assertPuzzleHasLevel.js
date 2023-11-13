import { logger } from '../logger.js';
import { getAllPuzzlesForYear } from '../validation/validatePuzzle.js';

/**
 * Asserts that the days puzzle has the level.
 * All days have two levels except for the last day which has one.
 */
export const assertPuzzleHasLevel = ({ year, day, level } = {}) => {
  const hasLevel = getAllPuzzlesForYear(year).some(
    (x) => x.level === level && x.day === day
  );
  if (!hasLevel) {
    logger.error(`Day ${day} does not have level ${level}.`);
  }
  return hasLevel;
};
