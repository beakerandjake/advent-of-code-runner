/**
 * The names of the puzzle columns in the completion table.
 */
export const puzzleDataColumnNames = ['Puzzle', 'Solved', 'Attempts', 'Execution Time'];

/**
 * Returns the title of the table
 * @param {Number} year
 */
export const getTableTitle = (year) => {
  if (year == null || year === '') {
    throw new Error('null or undefined year');
  }
  return `Advent of Code ${year}`;
};

/**
 * Returns text for the "Puzzle" column.
 */
export const getPuzzleColumnText = (day, part) => {
  if (day == null || day === '') {
    throw new Error('null or undefined day');
  }

  if (part == null || part === '') {
    throw new Error('null or undefined part');
  }

  return `${day}.${part}`;
};

/**
 * Returns text for the "Solved" column.
 */
export const getSolvedColumnText = (solved) => (solved ? '✓' : '');
