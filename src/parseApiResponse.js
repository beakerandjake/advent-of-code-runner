import { JSDOM } from 'jsdom';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { LockedOrCompletedPuzzleError } from './errors/LockedOrCompletedPuzzleError.js';
import { TooManySubmissionsError } from './errors/TooManySubmissionsError.js';

/**
 * Parses the response html document and returns the text content of the <main> element.
 * @param {String} responseBody - The html of the response.
 */
const extractMessage = (responseBody = '') => {
  logger.verbose('extracting message from api response');

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
  );
};

/**
 * Determine if the puzzle was solved or not.
 * @param {String} responseBody - The body of the response
 * @returns
 */
export const parseSolutionResponse = (responseBody = '') => {
  const message = extractMessage(responseBody);

  if (!message) {
    throw new Error('Failed to parse response from API, could not get message from main element');
  }

  const sanitizedMessage = sanitizeMessage(message);

  // check solution was correct
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.correctSolution'))) {
    logger.debug('message indicated solution was correct');
    return { success: true, message: sanitizeMessage };
  }
  // check solution was incorrect
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.incorrectSolution'))) {
    logger.debug('message indicated solution was incorrect');
    return { success: false, message: sanitizeMessage };
  }
  // check bad level, indicates user tried to solve locked or already solved part.
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.badLevel'))) {
    throw new LockedOrCompletedPuzzleError(sanitizedMessage);
  }

  // check too many requests
  if (sanitizedMessage.match(getConfigValue('aoc.responseParsing.tooManyRequests'))) {
    throw new TooManySubmissionsError(sanitizedMessage);
  }

  throw new Error(`Unable to parse response message: ${sanitizedMessage}`);
};
