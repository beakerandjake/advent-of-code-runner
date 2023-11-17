/* istanbul ignore file */
/* eslint-disable no-unused-vars */
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Queries the Advent of Code website for the input for a given year and day.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 * @returns {Promise<string>}
 */
export const getInput = async (year, day, authenticationToken) => {
  logger.debug('downloading mock input file for year: %s, day: %s', year, day);
  return `${[...Array(100).keys()].map((x) => x + 1).join('\n')}\n`;
};

/**
 * Post a solution for the problem of the given year / day / level.
 * @param {Number} year - The year of the puzzle
 * @param {Number} day - The day of the puzzle.
 * @param {1|2} level - The level of the puzzle
 * @param {String|Number} solution - The solution to test.
 * @param {String} authenticationToken - Token to authenticate with aoc.
 */
export const postAnswer = async (
  year,
  day,
  level,
  solution,
  authenticationToken
) => {
  logger.debug('posting answer to mock api');
  return getConfigValue('aoc.mockApi.answerCorrect')
    ? "that's the right answer"
    : "that's not the right answer";
};
