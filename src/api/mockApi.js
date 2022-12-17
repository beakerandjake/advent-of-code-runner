/* eslint-disable no-unused-vars */
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

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
  logger.verbose('downloading mock input file for year: %s, day: %s', year, day);
  return [...Array(100).keys()].map((x) => x + 1).join('\n');
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
  logger.verbose('submitting solution to mock api for year: %s, day: %s, part: %s', year, day, part);

  const success = getConfigValue('aoc.mockApi.answerCorrect');

  return { success, message: success ? 'Great Job you answered correct!' : 'That\'s the wrong answer!' };
};
