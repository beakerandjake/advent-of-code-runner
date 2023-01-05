/**
 * Outputs a table to the cli which shows the users progress for the year.
 * @param {Number} year
 */
export const outputCompletionTable = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }
};
