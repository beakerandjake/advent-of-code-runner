import { logger } from './logger.js';

const BASE_URL = process.env.AOC_BASE_URL || 'https://adventofcode.com';

/**
 * Generates a URL which when queried, returns the input for the given year and day.
 * @param {number} year
 * @param {number} dayNumber
 * @returns {String}
 */
const getInputURL = (year, dayNumber) =>
  `${BASE_URL}/${year}/day/${dayNumber}/input`;

/**
 * Queries the Advent of Code website for the input for a given year and day.
 * @param {Number} year
 * @param {Number} dayNumber
 * @param {String} authenticationToken
 * @returns {Promise<String>} The puzzle input for the given day.
 */
export const downloadInputFile = async (
  year,
  dayNumber,
  authenticationToken
) => {
  logger.info('downloading input file for year: %s, day: %s', year, dayNumber);

  if (!authenticationToken) {
    throw new Error('Authentication Token is required to download input file.');
  }

  const url = getInputURL(year, dayNumber);

  logger.info('querying url for input: %s', url);

  const response = await fetch(url, {
    headers: { Cookie: `session=${authenticationToken}` },
  });

  // bad request, authentication failed.
  if (response.status === 400) {
    throw new Error('Authentication failed, double check authentication token');
  }

  // handle all other error status codes
  if (!response.ok) {
    throw new Error(`Failed to download input file: ${response.statusText}`);
  }

  const text = await response.text();

  logger.info('downloaded: %skb', (Buffer.byteLength(z, 'utf-8') / 1000).toFixed(2))

  return text;
};
