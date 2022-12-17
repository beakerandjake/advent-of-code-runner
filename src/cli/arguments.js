import { Argument, InvalidArgumentError } from 'commander';
import { getConfigValue } from '../config.js';
import { betweenMessage } from '../formatting.js';
import { dayIsValid, partIsValid } from '../validatePuzzle.js';

/**
 * Parse the value as an integer.
 * @param {String} value - The value to parse.
 * @throws {InvalidArgumentError} Thrown if parsing fails.
 */
const parseIntArg = (arg) => {
  const numeric = Number.parseInt(arg, 10);

  if (!Number.isFinite(numeric)) {
    throw new InvalidArgumentError('Must be a number.');
  }

  return numeric;
};

const daysRange = betweenMessage(getConfigValue('aoc.puzzleValidation.days'));

/**
 * Argument for the puzzles day, returns an integer.
 * @throws {InvalidArgumentError} The day was invalid
 */
export const dayArgument = new Argument('<day>', `The day to solve (${daysRange}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!dayIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Days between ${daysRange}.`);
    }
    return parsed;
  });

const partsRange = betweenMessage(getConfigValue('aoc.puzzleValidation.parts'));

/**
 * Argument for the puzzles part, returns an integer.
 * @throws {InvalidArgumentError} The part was invalid
 */
export const partArgument = new Argument('<part>', `The part of the day to solve (${partsRange}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!partIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Parts ${partsRange}.`);
    }
    return parsed;
  });
