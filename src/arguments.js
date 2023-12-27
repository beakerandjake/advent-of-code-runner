import { Argument, InvalidArgumentError } from 'commander';
import { getConfigValue } from './config.js';

/**
 * Returns a function which parses the string value as an integer.
 * Then compares the parsed integer value to an array of choices.
 * The returned function throws an InvalidArgumentError if the value is not included in the choices.
 * @private
 * @param {number[]} choices - The valid options to choose from
 * @throws {RangeError} - The parsed integer value was not included in the choices.
 */
export const intParser = (choices) => (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError('Value could not be parsed as an integer.');
  }
  if (!choices.includes(parsed)) {
    const min = Math.min(...choices);
    const max = Math.max(...choices);
    throw new InvalidArgumentError(`Value must be between ${min} and ${max}.`);
  }
  return parsed;
};

/**
 * Wraps the argument name with brackets indicating if it's required or not.
 * @private
 * @param {string} name
 * @param {boolean} required
 */
export const decorateName = (name, required) =>
  required ? `<${name}>` : `[${name}]`;

/**
 * Returns a commander.js Argument for the day of a puzzle.
 * @param {boolean} required
 * @returns {Argument}
 */
export const getDayArg = (required) =>
  new Argument(
    decorateName('day', required),
    'The day of the puzzle to solve (1-25).'
  ).argParser(intParser(getConfigValue('aoc.validation.days')));

/**
 * Returns a commander.js Argument for the level of a puzzle.
 */
export const getLevelArg = (required) =>
  new Argument(
    decorateName('level', required),
    `The the level of the puzzle to solve (1 or 2).`
  ).argParser(intParser(getConfigValue('aoc.validation.levels')));
