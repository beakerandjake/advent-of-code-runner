import chalk from 'chalk';
import { table } from 'table';
import { humanizeDuration } from '../formatting.js';
import {
  getPuzzleColumnText,
  getSolvedColumnText,
  getNumberOfAttemptsColumnText,
  getExecutionTimeColumnText,
  getSolvedSummaryText,
} from './completionTable.js';

/**
 * Add a color to the solved check.
 * @param {String} text
 */
const colorizeSolved = (text) => (text ? chalk.green(text) : text);

/**
 * Add color to the number of attempts text.
 * @param {String} text
 * @param {Boolean} solved
 */
const colorizeAttempts = (text, solved) => {
  // highlight highest number of attempts
  if (text.includes('worst')) {
    return chalk.yellow(text);
  }

  // highlight solved on first attempt.
  if (text === '1' && solved) {
    return chalk.green(text);
  }

  return text;
};

/**
 * Add color to the execution time text.
 * @param {String} text
 * @param {Boolean} solved
 */
const colorizeExecutionTime = (text) => {
  // highlight slowest time
  if (text.includes('worst')) {
    return chalk.yellow(text);
  }
  // highlight fastest time
  if (text.includes('best')) {
    return chalk.green(text);
  }

  return text;
};

/**
 * Converts a row of puzzle completion data to the format expected by our table
 */
const toTableRow = ({
  day, part, solved, numberOfAttempts, executionTimeNs,
}, {
  maxAttempts, minExecutionTime, maxExecutionTime,
}) => ([
  getPuzzleColumnText(day, part),
  colorizeSolved(getSolvedColumnText(solved)),
  colorizeAttempts(getNumberOfAttemptsColumnText(numberOfAttempts, maxAttempts), solved),
  colorizeExecutionTime(
    getExecutionTimeColumnText(executionTimeNs, maxExecutionTime, minExecutionTime),
  ),
]);

/**
 * Generates a table from the data which can be printed to the cli.
 * @param {Object[]} completionData
 * @param {Object} summaryData
 */
export const generateTable = (year, completionData, summaryData) => {
  const headerRows = [
    [`Advent of Code ${year}`, '', '', ''],
    ['Puzzle', 'Solved', 'Attempts', 'Execution Time'],
  ];

  const puzzleRows = completionData.map((x) => toTableRow(x, summaryData));

  const summaryRows = [
    ['Average',
      '',
      summaryData.averageNumberOfAttempts.toFixed(2),
      humanizeDuration(summaryData.averageExecutionTimeNs),
    ],
    [getSolvedSummaryText(summaryData.numberSolved, summaryData.totalPuzzles), '', '', ''],
  ];

  const tableConfig = {
    columnDefault: { alignment: 'left' },
    columns: [
      { alignment: 'right' },
      { alignment: 'center' },
    ],
    spanningCells: [
      // Header Row
      {
        col: 0, row: 0, colSpan: 4, alignment: 'center',
      },
      // Average Row
      { col: 0, row: headerRows.length + puzzleRows.length, colSpan: 2 },
      // Solved Row
      {
        col: 0, row: 1 + headerRows.length + puzzleRows.length, colSpan: 4, alignment: 'center',
      },
    ],
    // don't draw lines between puzzle rows (makes table more compact)
    drawHorizontalLine: (lineIndex) => (
      lineIndex <= headerRows.length || lineIndex >= headerRows.length + puzzleRows.length
    ),
  };

  return table([...headerRows, ...puzzleRows, ...summaryRows], tableConfig);
};
