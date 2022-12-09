import { InvalidArgumentError } from 'commander';
import { toNumber, first } from 'lodash-es';


/**
 * Parse the value as an integer, and ensure that it is included in the choices.
 * @param {String} value - The value to parse.
 * @param {Number[]} choices - The valid values that the argument can be.
 * @throws {InvalidArgumentError} Thrown if parsing fails.
 */
export const parseIntFromChoices = (value, choices = []) => {
  const numeric = toNumber(value);

  if (!Number.isFinite(numeric)) {
    throw new InvalidArgumentError('Must be a number.');
  }

  if (!choices.includes(numeric)) {
    throw new InvalidArgumentError(`Allowed choices are: ${choices.join(',')}`);
  }

  return parseInt(numeric, 10);
};

/**
 * Parse the value as an integer.
 * @param {String} value - The value to parse.
 * @throws {InvalidArgumentError} Thrown if parsing fails.
 */
export const parseIntArg = (arg) => {
  const numeric = toNumber(arg);

  if (!Number.isFinite(numeric)) {
    throw new InvalidArgumentError('Must be a number.');
  }

  return parseInt(numeric, 10);
};

/**
 * Given a sorted array, generates a string like 'between $(first) and $(last)'
 * @param {Any[]} choices
 */
export const betweenMessage = (choices = []) => (`between ${first(choices)} and ${last(choices)}`);
