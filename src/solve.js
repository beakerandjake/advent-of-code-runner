import { downloadInput } from './api.js';
import { getConfigValue } from './config.js';
import { inputIsCached, getCachedInput, cacheInput } from './inputCache.js';
import { logger } from './logger.js';
import { execute } from './solutionRunner.js';

/**
 * Returns the input for the given puzzle.
 * Will download and cache inputs which have not already been cached.
 * @param {Number} year
 * @param {Number} day
 */
const getInput = async (year, day) => {
  logger.verbose('getting input for year: %s, day: %s', year, day);

  let toReturn;

  if (!await inputIsCached(year, day)) {
    toReturn = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
    await cacheInput(year, day, toReturn);
  } else {
    toReturn = await getCachedInput(year, day);
  }

  return toReturn;
};

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part) => {
  logger.verbose('running solution for year: %s, day: %s, part: %s', year, day, part);

  const input = await getInput(year, day);
  const { solution, executionTimeNs } = await execute(year, day, part, input);

  logger.verbose('finished running solution, result: %s', solution);
  logger.debug('solution executed in: %sns', executionTimeNs);

  return { solution, executionTimeNs };
};
