import { Argument, InvalidArgumentError } from 'commander';
import { getConfigValue } from '../config.js';
import { betweenMessage } from '../formatting.js';
import { dayIsValid, partIsValid, parsePositiveInt } from '../validation/index.js';

/**
 * Parses a positive int from the arg value, then validates and returns the parsed value.
 * @private
 * @param {String} value - The value to parse as an int.
 * @param {Function} validationFn - Function which validates the parsed int value.
 * @param {String} errorMessage - Message passed to error on failure.
 */
export const parseArgument = (value, validationFn, errorMessage) => {
  try {
    const parsed = parsePositiveInt(value);
    if (!validationFn(parsed)) {
      throw new RangeError();
    }
    return parsed;
  } catch (error) {
    throw new InvalidArgumentError(errorMessage);
  }
};

const daysRange = betweenMessage(getConfigValue('aoc.validation.days'));

/**
 * Argument for the puzzles day, returns an integer.
 * @throws {InvalidArgumentError} The day was invalid
 */
export const dayArgument = new Argument('<day>', `The day to solve (${daysRange}).`)
  .argParser((value) => parseArgument(
    value,
    dayIsValid,
    `Allowed Days between ${daysRange}.`,
  ));

const partsRange = betweenMessage(getConfigValue('aoc.validation.parts'));

/**
 * Argument for the puzzles part, returns an integer.
 * @throws {InvalidArgumentError} The part was invalid
 */
export const partArgument = new Argument('<part>', `The part of the day to solve (${partsRange}).`)
  .argParser((value) => parseArgument(
    value,
    partIsValid,
    `Allowed Parts ${partsRange}.`,
  ));
