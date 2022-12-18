import { downloadInput } from './api/index.js';
import { getConfigValue } from './config.js';
import { humanizeDuration } from './formatting.js';
import { inputIsCached, getCachedInput, cacheInput } from './inputs/inputCache.js';
import { logger } from './logger.js';
import { execute } from './solutionRunner.js';

/**
 * Downloads the input file from the aoc api and saves it to the input cache.
 * @param {Number} year
 * @param {Number} day
 * @throws {RateLimitExceededError} The user has not waited long enough to download the input file.
 */
const downloadAndCacheInput = async (year, day) => {
  const input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
  await cacheInput(year, day, input);
  return input;
};

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
    logger.festive('Downloading and caching input file');
    toReturn = await downloadAndCacheInput(year, day);
  } else {
    logger.festive('Loading cached input file');
    toReturn = await getCachedInput(year, day);
  }

  return toReturn;
};

/**
 * Runs the answer for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part) => {
  logger.verbose('solving year: %s, day: %s, part: %s', year, day, part);

  const input = await getInput(year, day);

  logger.festive('Executing solution function');

  const { answer, executionTimeNs } = await execute(year, day, part, input);

  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));

  return { answer, executionTimeNs };
};
