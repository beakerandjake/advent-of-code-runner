import { table } from 'table';
import chalk from 'chalk';
import { average } from '../../util.js';
import { humanizeDuration } from '../../formatting.js';
import { getPuzzleCompletionData, summarizeCompletionData } from '../../statistics.js';

/**
 * Returns text for the "Puzzle" column.
 * @param {Number} day
 * @param {Number} part
 */
const puzzleNameText = (day, part) => `${day}.${part}`;

/**
 * Returns text for the "Solved" column.
 * @param {Boolean} solved
 */
const solvedText = (solved) => `${solved ? '✓' : ''}`;

const numberOfAttemptsText = (numberOfAttempts, maxNumberOfAttempts) => {
  if (numberOfAttempts == null) {
    return '';
  }

  if (maxNumberOfAttempts > 1 && numberOfAttempts === maxNumberOfAttempts) {
    return `${numberOfAttempts} (worst)`;
  }

  return numberOfAttempts;
};

const executionTimeText = (executionTimeNs, slowest, fastest) => {
  if (executionTimeNs == null) {
    return '';
  }
  const text = humanizeDuration(executionTimeNs);

  if (fastest > 0 && executionTimeNs === fastest) {
    return `${text} (best)`;
  }

  if (slowest > 0 && executionTimeNs === slowest) {
    return `${text} (worst)`;
  }

  return text;
};

/**
 * Outputs a table to the cli which shows the users progress for the year.
 * @param {Number} year
 */
export const outputCompletionTable = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }

  const completionData = (await getPuzzleCompletionData(year));
  const summary = summarizeCompletionData(completionData);
  console.log(summary);

  const tableData = [
    [`Advent of Code ${year}`, '', '', ''],
    ['Puzzle', 'Solved', 'Execution Time', '# of Attempts'],
    ...completionData.map(({
      day, part, solved, executionTimeNs, numberOfAttempts,
    }) => [
      puzzleNameText(day, part),
      solvedText(solved),
      executionTimeText(executionTimeNs, summary.minExecutionTime, summary.maxExecutionTime),
      numberOfAttemptsText(numberOfAttempts, summary.maxAttempts),
    ]),
    [
      'Average',
      '',
      executionTimeText(summary.averageExecutionTimeNs),
      numberOfAttemptsText(summary.averageNumberOfAttempts.toFixed(2)),
    ],
    [`Solved ${summary.numberSolved}/${summary.totalPuzzles} (${(summary.percentSolved * 100).toFixed()}%)`, '', '', ''],
  ];

  const config = {
    columnDefault: { alignment: 'left' },
    spanningCells: [
      {
        col: 0, row: 0, colSpan: 4, alignment: 'center',
      },
      // { col: 0, row: 1, colSpan: 2 },
      { col: 0, row: 2 + completionData.length, colSpan: 2 },
      {
        col: 0, row: 3 + completionData.length, colSpan: 4, alignment: 'center',
      },
    ],
    drawHorizontalLine: (lineIndex) => lineIndex <= 2 || lineIndex >= 2 + completionData.length,
  };

  console.log(table(tableData, config));
};
