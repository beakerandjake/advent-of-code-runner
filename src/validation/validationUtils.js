/**
 * Parses the value as a positive integer.
 * @param {Number|String} value
 * @throws {TypeError} Value was not a valid number
 * @throws {RangeError} Value was negative
 */
export const parsePositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new TypeError('Value was not a number');
  }

  if (!Number.isFinite(parsed)) {
    throw new TypeError('Value must be a finite number');
  }

  if (parsed < 0) {
    throw new RangeError('Value must be greater than zero');
  }

  return parsed;
};
