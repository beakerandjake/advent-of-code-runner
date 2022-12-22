import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';
import { sizeOfStringInKb } from '../formatting.js';
import { extractTextContentOfMain, sanitizeMessage, parseResponseMessage } from './parseSubmissionResponse.js';

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
 * Generates the base url for the puzzle
 * from this base url we can download input or submit solution
 * @param {Number} year
 * @param {Number} day
 */
const getBaseUrl = (year, day) => `${getConfigValue('aoc.baseUrl')}/${year}/day/${day}`;

/**
 * Queries the Advent of Code website for the input for a given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 */
export const downloadInput = async (year, day, authenticationToken) => {
  logger.verbose('downloading input file for year: %s, day: %s', year, day);

  if (!authenticationToken) {
    throw new Error('Authentication Token is required to query advent of code.');
  }

  // query api
  const url = `${getBaseUrl(year, day)}/input`;
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
    throw new Error(`Unexpected server error downloading input file, error: ${response.status} - ${response.statusText}`);
  }

  // expect text of response is the input.
  const text = (await response.text())?.trim() || '';
  logger.debug('downloaded: %skb', sizeOfStringInKb(text));

  if (!text) {
    throw new Error('Advent of code returned empty input');
  }

  return text;
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
    throw new Error('Authentication Token is required to query advent of code.');
  }

  // post to api
  const url = `${getBaseUrl(year, day)}/answer`;
  logger.debug('posting to url: %s', url);
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
  // bail on any other type of http error
  if (!response.ok) {
    throw new Error(`Failed to post solution, error: ${response.status} - ${response.statusText}`);
  }

  // advent of code doesn't return status codes, we have to parse the html.
  // grab the text content of the <main> element which contains the message we need.
  const responseMessage = sanitizeMessage(
    extractTextContentOfMain(await response.text()),
  );

  // the content of the message tells us what happened
  // parse this message to determine the submission result.
  return parseResponseMessage(responseMessage);
};
