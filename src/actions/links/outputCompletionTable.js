import { getBorderCharacters, table } from 'table';
import chalk from 'chalk';
import { average } from '../../util.js';
import { humanizeDuration } from '../../formatting.js';
import { getPuzzleCompletionData } from '../../statistics.js';

const puzzleName = (day, part) => `${day}.${part}`;
const solvedText = (solved) => `${solved ? chalk.green('✓') : ''}`;
const numberOfAttemptsText = (numberOfAttempts) => (numberOfAttempts === 1 ? chalk.greenBright.bold(numberOfAttempts) : numberOfAttempts);
const executionTimeText = (executionTimeNs, fastest, slowest) => {
  if (executionTimeNs == null) {
    return '';
  }
  const text = humanizeDuration(executionTimeNs);

  console.log(fastest, slowest, executionTimeNs);

  if (executionTimeNs === fastest) {
    return chalk.italic.greenBright(`${text} (fastest)`);
  }

  if (executionTimeNs === slowest) {
    return chalk.italic.yellow(`${text} (slowest)`);
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
  console.log(completionData);
  const fastestExecutionTime = Math.min(...completionData.map((x) => x.executionTimeNs).filter((x) => x > 0));
  const slowestExecutionTime = Math.max(...completionData.map((x) => x.executionTimeNs));

  const tableData = [
    [`Advent of Code ${year}`, '', '', ''],
    ['Puzzle', 'Solved', 'Execution Time', '# of Attempts'],
    ...completionData.map(({
      day, part, solved, executionTimeNs, numberOfAttempts,
    }) => [
      puzzleName(day, part),
      solvedText(solved),
      executionTimeText(executionTimeNs, fastestExecutionTime, slowestExecutionTime),
      numberOfAttemptsText(numberOfAttempts),
    ]),
    [
      'Average',
      '',
      humanizeDuration(average(completionData.map((x) => x.executionTimeNs))),
      average(completionData.map((x) => x.numberOfAttempts)).toFixed(2),
    ],
    ['Solved 4/50 (5%)', '', '', ''],
    // ['Count', '', 'Percentage', ''],
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
