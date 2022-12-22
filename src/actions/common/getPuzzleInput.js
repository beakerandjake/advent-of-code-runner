import { downloadInput } from '../../api/index.js';
import { cacheInput, getCachedInput, inputIsCached } from '../../inputs.js';
import { logger } from '../../logger.js';

/**
 * Returns the input for the puzzle.
 * If the input is cached, the cached input will be returned.
 * If the input is not cached, it will be downloaded and cached
 * @param {Object} args
 * @param {Number} args.year
 * @param {Number} args.day
 * @param {String} args.authToken
 */
export const getPuzzleInput = async (args = {}) => {
  const { year, day, authToken } = args;
  let input;

  logger.debug('getting puzzle input', { year, day });

  if (!await inputIsCached(year, day)) {
    logger.festive('Downloading and caching input file');
    input = await downloadInput(year, day, authToken);
    await cacheInput(year, day, input);
  } else {
    logger.festive('Loading cached input file');
    input = await getCachedInput(year, day);
  }

  return { ...args, input };
};
