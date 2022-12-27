/**
 * Splits the input string on new lines and returns an array of lines.
 * @param {String} input
 */
export const splitLines = (input) => {
  if (input == null) {
    return [];
  }

  if (!(typeof input === 'string')) {
    throw new TypeError('Expected argument of type String');
  }

  return input.split('\n');
};
