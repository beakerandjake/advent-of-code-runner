import { downloadInput } from '../api/index.js';
import { cacheInput, getCachedInput, inputIsCached } from '../inputs/inputCache.js';
import { logger } from '../logger.js';
import { inputIsValid } from '../validation/validateInput.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';

/**
 * Returns the input for the puzzle.
 * If the input is cached, the cached input will be returned.
 * If the input is not cached, it will be downloaded and cached
 */
export const getPuzzleInput = async ({ year, day } = {}) => {
  let input;

  if (!await inputIsCached(year, day)) {
    logger.festive('Downloading and caching input file');
    const { authToken } = getAuthenticationToken();
    input = await downloadInput(year, day, authToken);
    await cacheInput(year, day, input);
  } else {
    logger.festive('Loading cached input file');
    input = await getCachedInput(year, day);
  }

  // even though we loaded the input file, the contents could be invalid
  if (!inputIsValid(input)) {
    logger.error('Failed to load data from the input file. Loaded value was an empty string.');
    return false;
  }

  return { input };
};
