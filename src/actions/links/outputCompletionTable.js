import chalk from 'chalk';
import { table } from 'table';
import { humanizeDuration } from '../../formatting.js';
import { getPuzzleCompletionData, summarizeCompletionData } from '../../statistics.js';

/**
 * Returns text for the "Puzzle" column.
 */
const puzzleNameText = (day, part) => `${day}.${part}`;

/**
 * Returns text for the "Solved" column.
 */
const solvedText = (solved) => `${solved ? chalk.green('✓') : ''}`;

/**
 * Returns text for the "# of Attempts" column.
 */
const numberOfAttemptsText = (numberOfAttempts, maxNumberOfAttempts) => {
  if (numberOfAttempts == null) {
    return '';
  }

  if (maxNumberOfAttempts > 1 && numberOfAttempts === maxNumberOfAttempts) {
    return chalk.yellow(`${numberOfAttempts} (worst)`);
  }

  if (numberOfAttempts === 1) {
    return chalk.green(numberOfAttempts);
  }

  return numberOfAttempts;
};

/**
 * Returns text for the "Execution Time" column.
 */
const executionTimeText = (executionTimeNs, slowest, fastest) => {
  if (executionTimeNs == null) {
    return '';
  }
  const text = humanizeDuration(executionTimeNs);

  if (fastest > 0 && executionTimeNs === fastest) {
    return chalk.green(`${text} (best)`);
  }

  if (slowest > 0 && executionTimeNs === slowest) {
    return chalk.yellow(`${text} (worst)`);
  }

  return text;
};

/**
 * Converts a row of puzzle completion data to the format expected by our table
 */
const toTableRow = (completionRow, completionSummary) => ([
  puzzleNameText(completionRow.day, completionRow.part),
  solvedText(completionRow.solved),
  numberOfAttemptsText(completionRow.numberOfAttempts, completionSummary.maxAttempts),
  executionTimeText(
    completionRow.executionTimeNs,
    completionSummary.minExecutionTime,
    completionSummary.maxExecutionTime,
  ),
]);

/**
 * Generates text for the solved row.
 */
const solvedRowText = ({ numberSolved, totalPuzzles, percentSolved }) => (
  `Solved ${numberSolved}/${totalPuzzles} (${(percentSolved * 100).toFixed()}%)`
);

/**
 * Outputs a table to the cli which shows the users progress for the year.
 */
export const outputCompletionTable = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }

  const completionData = await getPuzzleCompletionData(year);
  const summaryData = summarizeCompletionData(completionData);

  const headerRows = [
    [chalk.green(`Advent of Code ${year}`), '', '', ''],
    ['Puzzle', 'Solved', 'Attempts', 'Execution Time'].map((x) => chalk.blue(x)),
  ];

  const puzzleRows = completionData.map((x) => toTableRow(x, summaryData));

  const summaryRows = [
    ['Average',
      '',
      numberOfAttemptsText(summaryData.averageNumberOfAttempts.toFixed(2)),
      executionTimeText(summaryData.averageExecutionTimeNs),
    ],
    [solvedRowText(summaryData), '', '', ''],
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

  console.log(table([...headerRows, ...puzzleRows, ...summaryRows], tableConfig));
};
