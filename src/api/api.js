import { getConfigValue } from '../config.js';
import { sizeOfStringInKb } from '../formatting.js';
import { logger } from '../logger.js';
import {
  extractTextContentOfMain,
  parseResponseMessage,
  sanitizeMessage,
} from './parseSubmissionResponse.js';
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
export const downloadInput = async (year, day, authenticationToken) => {
  logger.debug('downloading input file for year: %s, day: %s', year, day);

  if (!authenticationToken) {
    throw new Error(
      'Authentication Token is required to query advent of code.'
    );
  }

  // query api
  const url = puzzleInputUrl(year, day);
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
    throw new Error(
      `Unexpected server error while downloading input file, error: ${response.status} - ${response.statusText}`
    );
  }

  // expect text of response is the input.
  const text = await response.text();

  if (!text) {
    throw new Error('Advent of code returned empty input');
  }

  logger.debug('downloaded: %s', sizeOfStringInKb(text));

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
export const submitSolution = async (
  year,
  day,
  level,
  solution,
  authenticationToken
) => {
  logger.debug('submitting solution to advent of code', { year, day, level });

  if (!authenticationToken) {
    throw new Error(
      'Authentication Token is required to query advent of code.'
    );
  }

  // post to api
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

  // bad request, authentication failed.
  // as of writing advent returns a 302 to redirect the user to the puzzle page on fail
  // but check 400 too just incase.
  if (response.status === 400 || response.status === 302) {
    throw new Error('Authentication failed, double check authentication token');
  }
  // not found, invalid day or year.
  if (response.status === 404) {
    throw new Error('That year/day combination could not be found');
  }
  // bail on any other type of http error
  if (!response.ok) {
    throw new Error(
      `Unexpected server error while posting solution, error: ${response.status} - ${response.statusText}`
    );
  }

  // advent of code doesn't return status codes, we have to parse the html.
  // grab the text content of the <main> element which contains the message we need.
  const responseMessage = sanitizeMessage(
    extractTextContentOfMain(await response.text())
  );

  if (!responseMessage) {
    throw new Error('Unable get message from advent of code response.');
  }

  // the content of the message tells us what happened
  // parse this message to determine the submission result.
  return parseResponseMessage(responseMessage);
};
