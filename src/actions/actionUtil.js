import { requiredPartsHaveBeenSolved } from '../answers.js';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { puzzleIsInFuture, yearIsValid } from '../validation/index.js';

/**
 * Grabs the year value from the config, validates and returns it.
 * @throws {RangeError}
 * @returns {Number}
 */
export const getYear = () => {
  const year = getConfigValue('aoc.year');

  if (!yearIsValid(year)) {
    throw new RangeError(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`);
  }

  return year;
};

/**
 * Asserts that the puzzle is unlocked and can be solved.
 * Function throws if the assertion fails.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @throws {PuzzleIsLockedError}
 * @throws {PuzzlePartIsLockedError}
 */
export const puzzleIsUnlocked = async (year, day, part) => {
  // don't allow solve future puzzles.
  if (puzzleIsInFuture(year, day)) {
    logger.error(`You cannot attempt this puzzle (day ${day}, part ${part}) because it is in the future and has not unlocked.`);
    return false;
  }
  // cant solve if haven't solved required parts.
  if (!await requiredPartsHaveBeenSolved(year, day, part)) {
    logger.error(`You cannot attempt this puzzle (day ${day}, part ${part}) because you have not completed the previously required part.`);
    return false;
  }

  return true;
};
