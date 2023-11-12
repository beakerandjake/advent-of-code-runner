import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';

/**
 * Asserts that the days puzzle has the level.
 * All days have two levels except for the last day which has one.
 */
export const assertPuzzleHasLevel = ({ day, level } = {}) => {
  // no need to validate if not the last day.
  if (day !== getConfigValue('aoc.validation.days').at(-1)) {
    return true;
  }

  // only level one is valid on the last day.
  if (level !== 1) {
    logger.error('Day 25 only has one level.');
    return false;
  }

  return true;
};
