import { downloadInput } from '../api/index.js';
import { cacheInput, getCachedInput, inputIsCached } from './inputCache.js';
import { inputIsValid } from '../validation/validateInput.js';
import { getAuthToken } from '../persistence/metaRepository.js';
import { InvalidPuzzleInputError } from '../errors/puzzleErrors.js';

/**
 * Downloads the input file and saves it to the inputs folder.
 * @returns {Promise<string>}
 */
const downloadAndCacheInput = async (year, day) => {
  const input = await downloadInput(year, day, getAuthToken());
  await cacheInput(year, day, input);
  return input;
};

/**
 * Returns the input for the puzzle.
 * If the input is cached, the cached input will be returned.
 * If the input is not cached, it will be downloaded and cached
 * @param {number} year
 * @param {number} day
 * @returns {Promise<string>}
 */
export const getPuzzleInput = async (year, day) => {
  const input = (await inputIsCached(year, day))
    ? await getCachedInput(year, day)
    : await downloadAndCacheInput(year, day);

  if (!inputIsValid(input)) {
    throw new InvalidPuzzleInputError();
  }

  return input;
};
