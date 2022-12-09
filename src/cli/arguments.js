import { Argument, InvalidArgumentError, Option } from 'commander';
import { toNumber } from 'lodash-es';
import { getConfigValue } from '../config.js';
import { betweenMessage } from '../formatting.js';
import { dayIsValid, partIsValid, yearIsValid } from '../validatePuzzle.js';

/**
 * Parse the value as an integer.
 * @param {String} value - The value to parse.
 * @throws {InvalidArgumentError} Thrown if parsing fails.
 */
const parseIntArg = (arg) => {
  const numeric = toNumber(arg);

  if (!Number.isFinite(numeric)) {
    throw new InvalidArgumentError('Must be a number.');
  }

  return parseInt(numeric, 10);
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

const yearsRange = betweenMessage(getConfigValue('aoc.puzzleValidation.years'));

/**
 * Argument for the puzzles year, returns an integer.
 * @throws {InvalidArgumentError} The year was invalid
 */
export const yearOption = new Option('-y, --year <number>', `The year of advent of code to solve (${yearsRange}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!yearIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Years ${yearsRange}.`);
    }
    return parsed;
  })
  .default(getConfigValue('aoc.year'));
