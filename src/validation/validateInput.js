/**
 * Ensures that the provided input is a non empty string.
 * @param {Any} input
 */
export const inputIsValid = (input) => {
  if (input == null) {
    return false;
  }

  if (!(typeof input === 'string')) {
    return false;
  }

  if (input.trim() === '') {
    return false;
  }

  return true;
};
