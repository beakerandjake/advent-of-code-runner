import { InvalidArgumentError } from 'commander';

/**
 * Returns a function which parses the string value as an integer.
 * Then compares the parsed integer value to an array of choices.
 * The returned function throws an InvalidArgumentError if the value is not included in the choices.
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
