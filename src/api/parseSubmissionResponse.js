import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { getElementByTagName, getTextContent } from './parseHtml.js';
import { RateLimitExceededError, SolvingWrongLevelError } from '../errors/apiErrors.js';

/**
 * Parses the response html, finds the <main> element and then extracts its text content.
 * @param {String} responseHtml
 * @returns {String}
 */
export const extractTextContentOfMain = (responseHtml) => {
  logger.debug('extracting text content of <main> element');

  // get the <main> element from the response html.
  const main = getElementByTagName(responseHtml, 'main');
  if (!main) {
    throw new Error(
      'Failed to parse html response from advent of code, could not extract text content of <main>'
    );
  }

  // grab the text content the <main> element.
  const text = getTextContent(main);
  logger.silly('extracted text from main: %s', text);
  if (!text) {
    throw new Error(
      'Failed to parse html response from advent of code, text content of <main> element was empty'
    );
  }

  return text;
};

/**
 * Removes unnecessary content from the message and applies standardized formatting.
 * @param {String} message
 */
export const sanitizeMessage = (message = '') => {
  logger.debug('sanitizing api response message');
  return getConfigValue('aoc.responseParsing.sanitizers')
    .reduce(
      (acc, sanitizer) => acc.replaceAll(sanitizer.pattern, sanitizer.replace),
      message
    )
    .trim();
};

/**
 * Parses the message from advent of code and determines the result
 * @param {String} message - The sanitized message extracted from the response body.
 */
export const parseResponseMessage = (message = '') => {
  logger.debug('parsing api response message');
  const matchers = getConfigValue('aoc.responseParsing');

  // check solution was correct
  if (message.match(matchers.correctSolution)) {
    logger.debug('message indicated solution was correct');
    return { correct: true, message };
  }
  // check solution was incorrect
  if (message.match(matchers.incorrectSolution)) {
    logger.debug('message indicated solution was incorrect');
    return { correct: false, message };
  }
  // check bad level, indicates user tried to solve locked or already solved level.
  if (message.match(matchers.badLevel)) {
    throw new SolvingWrongLevelError();
  }
  // check too many requests
  if (message.match(matchers.tooManyRequests)) {
    throw new RateLimitExceededError();
  }

  throw new Error(`Unable to parse response message: ${message}`);
};
