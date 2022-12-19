import { getConfigValue } from '../config.js';

/**
 * Does the year match one where advent of code was held?
 * @param {Number} year
 */
export const yearIsValid = (year) => getConfigValue('aoc.puzzleValidation.years').includes(year);

/**
 * Is the day one where an advent of code puzzle happens?
 * @param {Number} day
 */
export const dayIsValid = (day) => getConfigValue('aoc.puzzleValidation.days').includes(day);

/**
 * Is the part of the puzzle a valid value?
 * @param {Number} part
 */
export const partIsValid = (part) => getConfigValue('aoc.puzzleValidation.parts').includes(part);
