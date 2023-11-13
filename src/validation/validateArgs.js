import { InvalidArgumentError } from 'commander';
import { getConfigValue } from '../config.js';

/**
 * Does the year match one where advent of code was held?
 * @param {Number} year
 */
export const yearIsValid = (year) =>
  getConfigValue('aoc.validation.years').includes(year);

/**
 * Returns a function which parses the string value as an integer.
 * Then compares the parsed integer value to an array of choices.
 * The returned function throws an InvalidArgumentError if the value is not included in the choices.
 * @param {number[]} choices - The valid options to choose from
 * @throws {RangeError} - The parsed integer value was not included in the choices.
 */
export const intParser = (choices) => (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!choices.includes(parsed)) {
    const min = Math.min(...choices);
    const max = Math.max(...choices);
    throw new InvalidArgumentError(`Value must be between ${min} and ${max}.`);
  }
  return parsed;
};
