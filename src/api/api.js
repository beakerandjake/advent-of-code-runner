import { JSDOM } from 'jsdom';
import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';
import { sizeOfStringInKb } from '../formatting.js';
import { LockedOrCompletedPuzzleError, RateLimitExceededError } from '../errors/index.js';

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

/**
 * Parses the response html document and returns the text content of the <main> element.
 * @param {String} responseBody - The html of the response.
 */
const extractMessage = (responseBody = '') => {
  logger.debug('extracting message from api response');

  const { textContent } = new JSDOM(responseBody)
    .window
    .document
    .querySelector('main') || {};

  logger.debug('extracted text content from <main> element: %s', textContent);

  return textContent;
};

/**
 * Removes extra content from the api response message.
 * @param {String} message
 */
const sanitizeMessage = (message = '') => {
  logger.debug('sanitizing api response message');

  return getConfigValue('aoc.responseParsing.sanitizers').reduce(
    (acc, sanitizer) => acc.replace(sanitizer.pattern, sanitizer.replace),
    message,
  ).trim();
};

/**
 * Determine if the puzzle was solved or not.
 * @param {String} responseBody - The body of the response
 */
const parseSolutionResponse = (responseBody = '') => {
  const message = extractMessage(responseBody);

  if (!message) {
    throw new Error('Failed to parse response from API, could not get message from main element');
  }

  const sanitizedMessage = sanitizeMessage(message);

  // check solution was correct
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.correctSolution'))) {
    logger.debug('message indicated solution was correct');
    return { success: true, message: sanitizedMessage };
  }
  // check solution was incorrect
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.incorrectSolution'))) {
    logger.debug('message indicated solution was incorrect');
    return { success: false, message: sanitizedMessage };
  }
  // check bad level, indicates user tried to solve locked or already solved part.
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.badLevel'))) {
    throw new LockedOrCompletedPuzzleError(sanitizedMessage);
  }

  // check too many requests
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.tooManyRequests'))) {
    throw new RateLimitExceededError(sanitizedMessage);
  }

  throw new Error(`Unable to parse response message: ${sanitizedMessage}`);
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
  logger.festive('Submitting your answer to advent of code');
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

  const bodyText = await response.text();

  return parseSolutionResponse(bodyText);
};
