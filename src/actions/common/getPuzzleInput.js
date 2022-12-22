import { downloadInput } from '../../api/index.js';
import { cacheInput, getCachedInput, inputIsCached } from '../../inputs.js';
import { logger } from '../../logger.js';

/**
 * Returns the input for the puzzle.
 * If the input is cached, the cached input will be returned.
 * If the input is not cached, it will be downloaded and cached.
 */
export const getPuzzleInput = async ({
  year, day, authToken, ...args
}) => {
  logger.debug('getting puzzle input', { year, day });
  let input;

  if (!await inputIsCached(year, day)) {
    logger.festive('Downloading and caching input file');
    input = await downloadInput(year, day, authToken);
    await cacheInput(year, day, input);
  } else {
    logger.festive('Loading cached input file');
    input = await getCachedInput(year, day);
  }

  return {
    ...args, year, day, authToken, input,
  };
};
