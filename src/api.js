import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { sizeOfStringInKb } from './utils.js';

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
 * Generates a URL which when queried, returns the input for the given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 */
const getInputURL = (year, day) => `${getConfigValue('aoc.baseUrl')}/${year}/day/${day}/input`;

/**
 * Queries the Advent of Code website for the input for a given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 */
export const downloadInput = async (
  year,
  day,
  authenticationToken,
) => {
  logger.verbose('downloading input file for year: %s, day: %s', year, day);

  if (!authenticationToken) {
    throw new Error('Authentication Token is required to download input file.');
  }

  const url = getInputURL(year, day);

  logger.debug('querying url for input: %s', url);

  const response = await fetch(url, {
    headers: getHeaders(authenticationToken),
  });

  // bad request, authentication failed.
  if (response.status === 400) {
    throw new Error('Authentication failed, double check authentication token');
  }

  // not found, invalid day or year.
  if (response.status === 404) {
    throw new Error('That year/day combination could not be found');
  }

  // handle all other error status codes
  if (!response.ok) {
    throw new Error(`Failed to download input file: ${response.statusText}`);
  }

  const text = (await response.text()) || '';

  logger.debug('downloaded: %skb', sizeOfStringInKb(text));

  return text.trim();
};

/**
 * Generates a URL for submitting the input for the given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 */
const getSubmitSolutionUrl = (year, day) => `${getConfigValue('aoc.baseUrl')}/${year}/day/${day}/answer`;

const parseSolutionResponseHtml = (html) => {
  // wrong answer too hight: That's not the right answer; your answer is too high.
// invalid part (part not 1 or 2, or submitting 2 without solving 1):
//     You don't seem to be solving the right level.  Did you already complete it?
//
// general shape is <main><article><p>
  logger.info('parsing solution result from: %s', html);
  return 'COOL GUY';
};

/**
 * Post a solution for the problem of the given year / day / part.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {1|2} part - Is this part one or part two of the puzzle?
 * @param {String|Number} solution - The solution to test.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 */
export const submitSolution = async (year, day, part, solution, authenticationToken) => {
  logger.verbose('submitting solution to advent of code for year: %s, day: %s, part: %s', year, day, part);

  if (!authenticationToken) {
    throw new Error('Authentication Token is required to submit the solution.');
  }

  const url = getSubmitSolutionUrl(year, day);

  logger.debug('posting to url for solution: %s', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...getHeaders(authenticationToken), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `level=${part}&answer=${solution}`,
  });

  // bad request, authentication failed.
  if (response.status === 400) {
    throw new Error('Authentication failed, double check authentication token');
  }

  // not found, invalid day or year.
  if (response.status === 404) {
    throw new Error('That year/day combination could not be found');
  }

  if (!response.ok) {
    throw new Error(`Failed to post solution: ${response.statusText}`);
  }

  const text = await response.text();
  return parseSolutionResponseHtml(text);
};
