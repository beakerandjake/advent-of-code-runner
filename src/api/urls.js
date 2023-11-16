import { getConfigValue } from '../config.js';

/**
 * Returns the base url for the puzzle
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleBaseUrl = (year, day) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }
  if (day == null) {
    throw new Error('null or undefined day');
  }
  return `${getConfigValue('aoc.baseUrl')}/${year}/day/${day}`;
};

/**
 * Returns the url for downloading the puzzle input.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleInputUrl = (year, day) =>
  `${puzzleBaseUrl(year, day)}/input`;

/**
 * Returns the url for submitting the puzzle answer.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleAnswerUrl = (year, day) =>
  `${puzzleBaseUrl(year, day)}/answer`;
