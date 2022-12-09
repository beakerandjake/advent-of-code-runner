import { downloadInput } from './api/index.js';
import { getConfigValue } from './config.js';
import { RateLimitExceededError } from './errors/RateLimitExceededError.js';
import { inputIsCached, getCachedInput, cacheInput } from './inputCache.js';
import { logger } from './logger.js';
import { checkActionRateLimit, rateLimitedActions, updateRateLimit } from './rateLimit.js';
import { execute } from './solutionRunner.js';

/**
 * Downloads the input file from the aoc api and saves it to the input cache.
 * @param {Number} year
 * @param {Number} day
 * @throws {RateLimitExceededError} The user has not waited long enough to download the input file.
 */
const downloadAndCacheInput = async (year, day) => {
  const { limited, expiration } = await checkActionRateLimit(rateLimitedActions.downloadInput);

  // prevent submission if user is rate limited.
  if (limited) {
    throw new RateLimitExceededError('Timeout period for downloading an input file has not expired.', expiration);
  }

  const input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
  await updateRateLimit(rateLimitedActions.downloadInput);
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
    toReturn = await downloadAndCacheInput(year, day);
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
