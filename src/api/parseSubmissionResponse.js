import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { getElementByTagName, getTextContent } from './parseHtml.js';

/**
 * Parses the response html, finds the <main> element and then extracts its text content.
 * @private
 * @param {String} responseHtml
 * @returns {String}
 */
export const extractTextContentOfMain = (responseHtml) => {
  logger.debug('extracting text content of <main> element');

  // get the <main> element from the response html.
  const main = getElementByTagName(responseHtml, 'main');
  if (!main) {
    throw new Error('Failed to parse html response from advent of code, could not extract text content of <main>');
  }

  // grab the text content the <main> element.
  const text = getTextContent(main);
  logger.silly('extracted text from main: %s', text);
  if (!text) {
    throw new Error('Failed to parse html response from advent of code, text content of <main> element was empty');
  }

  return text;
};

/**
 * Removes unnecessary content from the message and applies standardized formatting.
 * @private
 * @param {String} message
 */
export const sanitizeMessage = (message = '') => {
  logger.debug('sanitizing api response message');

  return getConfigValue('aoc.responseParsing.sanitizers').reduce(
    (acc, sanitizer) => acc.replace(sanitizer.pattern, sanitizer.replace),
    message,
  ).trim();
};

export const parseSubmissionResponse = (responseHtml) => {
  const message = extractTextContentOfMain(responseHtml);
};
