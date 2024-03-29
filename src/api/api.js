import { getConfigValue } from '../config.js';
import {
  EmptyResponseError,
  InternalServerError,
  NotAuthorizedError,
  PuzzleNotFoundError,
} from '../errors/apiErrors.js';
import { sizeOfStringInKb } from '../formatting.js';
import { logger } from '../logger.js';
import { puzzleAnswerUrl, puzzleInputUrl } from './urls.js';
/**
 * Creates a headers object which can be passed to fetch.
 * Contains the headers necessary to interact with the aoc api.
 * @param {String} authenticationToken
 */
const getHeaders = (authenticationToken) => ({
  Cookie: `session=${authenticationToken}`,
  'User-Agent': getConfigValue('aoc.userAgent'),
});

/**
 * Queries the Advent of Code website for the input for a given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {Promise<String>} authenticationToken - Token to authenticate with aoc.
 */
export const getInput = async (year, day, authenticationToken) => {
  logger.debug('downloading input file for year: %s, day: %s', year, day);
  if (!authenticationToken) {
    throw new NotAuthorizedError();
  }

  const url = puzzleInputUrl(year, day);
  logger.debug('querying url for input: %s', url);
  const response = await fetch(url, {
    headers: getHeaders(authenticationToken),
  });

  if (response.status === 400) {
    throw new NotAuthorizedError();
  }
  if (response.status === 404) {
    throw new PuzzleNotFoundError(year, day);
  }
  if (!response.ok) {
    throw new InternalServerError(response.status, response.statusText);
  }

  const text = await response.text();
  logger.debug('downloaded: %s', sizeOfStringInKb(text));
  if (!text) {
    throw new EmptyResponseError();
  }
  return text;
};

/**
 * Post a solution for the problem of the given year / day / level.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {1|2} level - The level of the puzzle
 * @param {String|Number} solution - The solution to test.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 */
export const postAnswer = async (
  year,
  day,
  level,
  solution,
  authenticationToken
) => {
  logger.debug('posting answer to advent of code', { year, day, level });

  if (!authenticationToken) {
    throw new NotAuthorizedError();
  }

  const url = puzzleAnswerUrl(year, day);
  logger.debug('posting to url: %s', url);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getHeaders(authenticationToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `level=${level}&answer=${solution}`,
  });

  // server can sometimes redirect (302) back to puzzle page if auth fails.
  if (response.status === 400 || response.status === 302) {
    throw new NotAuthorizedError();
  }
  if (response.status === 404) {
    throw new PuzzleNotFoundError(year, day);
  }
  if (!response.ok) {
    throw new InternalServerError(response.status, response.statusText);
  }

  const text = await response.text();
  if (!text) {
    throw new EmptyResponseError();
  }
  return text;
};
