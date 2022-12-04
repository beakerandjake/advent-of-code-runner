import timestring from 'timestring';
import numbered from 'numbered';
import { JSDOM } from 'jsdom';
import { getConfigValue } from './config.js';

import { logger } from './logger.js';

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

const sanitizeMessage = (message = '') => getConfigValue('aoc.responseParsing.sanitizers').reduce((acc, sanitizer) => acc.replace(sanitizer.pattern, sanitizer.replace), message);

/**
 * Returns a new Date with x milliseconds added to it.
 * @param {Date} date
 * @param {Number} ms
 */
const addMsToDate = (date, ms) => new Date(date.getTime() + ms);

/**
 * Parses a human readable string into a date from now.
 * @param {String} duration - A human readable string in the format "AMOUNT UNIT" ie "five minutes"
 */
const parseRateLimitExpiration = (duration) => {
  logger.debug('parsing expiration date from duration string: "%s"', duration);

  try {
    const [amount, unit] = duration.split(' ');

    // convert from words to numbers ex: "ten minutes" to "10 minutes"
    const parsedAmount = numbered.parse(amount) || parseInt(amount, 10);
    logger.debug('parsed number: %d from: "%s"', parsedAmount, amount);

    // parse the converted duration into seconds.
    const convertedDuration = `${parsedAmount} ${unit}`;
    const seconds = timestring(convertedDuration);
    logger.debug('parsed %s seconds from: "%s"', seconds, convertedDuration);

    if (seconds <= 0) {
      throw new Error('Parsed zero seconds from duration string');
    }

    return addMinutesToDate(new Date(), Math.max(1, seconds / 60));
  } catch (error) {
    // lots could fail here, just return default value instead of raising exception.
    logger.error('Failed to parse Rate Limit from duration string. "%s"', duration);
    return addMinutesToDate(new Date(), 5);
  }
};

/**
 * Examines the api response for a sentence asking the user to wait before trying again.
 * If found, parses this message into a usable format.
 * @param {String} message - The text of the api response.
 */
const parseRateLimit = (message) => {
  const matches = message.match(getConfigValue('aoc.responseParsing.rateLimitRegex'));

  if (!matches) {
    logger.debug('rate limit message was not included in the response message');
    return { message: null, expirationDate: null };
  }

  const rateLimitMessage = matches[0];
  logger.debug('parsed rate limit message: "%s"', rateLimitMessage);

  const rateLimitExpiration = parseRateLimitExpiration(matches[1]);
  logger.debug('parsed rate limit expiration: %s', rateLimitExpiration);

  return { message: rateLimitMessage, expirationDate: rateLimitExpiration };
};

const getNextSubmissionTime = (message) => {
  const matches = message.match(getConfigValue('aoc.responseParsing.rateLimitRegex'));

  // if the response didn't explicitly include a rate limit message, use default rate limit
  if (!matches) {
    return addMsToDate(new Date(), getConfigValue('aoc.submitRateLimitMs'));
  }

  try {
    const [amount, unit] = matches[1].split(' ');
    // convert from words to numbers ex: "ten minutes" to "10 minutes"
    const parsedAmount = numbered.parse(amount) || parseInt(amount, 10);
    logger.debug('parsed number: %d from: "%s"', parsedAmount, amount);

    // parse the converted duration into seconds.
    const convertedDuration = `${parsedAmount} ${unit}`;
    const seconds = timestring(convertedDuration);
    logger.debug('parsed %s seconds from: "%s"', seconds, convertedDuration);

    if (seconds <= 0) {
      throw new Error('Parsed zero seconds from duration string');
    }

    return addMsToDate(new Date(), Math.max(1, seconds * 1000));
  } catch (error) {
    // lots could fail here, just return default value instead of raising exception.
    logger.error('Failed to parse next submission time from message. "%s"', matches[0]);
  }

  return addMsToDate(new Date(), getConfigValue('aoc.submitRateLimitMs'));
};

/**
 * Determine if the solution was correct or not.
 * @param {String} responseBody - The body of the response
 * @returns
 */
export const parseSolutionResponse = (responseBody) => {
  const message = extractMessage(responseBody);

  if (!message) {
    throw new Error('Failed to parse response from API, could not get message from main element');
  }

  const sanitizedMessage = sanitizeMessage(message);

  // determine if success,

  // return { message, success, rateLimitMessage, rateLimitExpiration }

  // logger.info('parsing solution result from: %s', text);
};

// \[Return to Day \d+\]

// That's not the right answer. Because you have guessed incorrectly 6 times on this puzzle, please wait 5 minutes before trying again. 
// You gave an answer too recently; you have to wait after submitting an answer before trying again.  You have 4m 36s left to wait. [Return to Day 1]
// You don't seem to be solving at the right level
// That's the right answer.