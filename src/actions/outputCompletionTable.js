import chalk from 'chalk';
import { table } from 'table';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
import {
  getAverageAttempts,
  getAverageRuntime,
  getFastestRuntime,
  getMaxAttempts,
  getPuzzleCompletionData,
  getSlowestRuntime,
  getSolvedCount,
} from '../statistics.js';
import { getTotalPuzzleCount } from '../validation/validatePuzzle.js';

/**
 * Generates the text for the name column.
 * @private
 */
export const mapNamedColumn = ({ day, part, solved }) => {
  const text = `${day}.${part}`;
  return solved ? chalk.green(text) : text;
};

/**
 * Generates the text for the solved column.
 * @private
 */
export const mapSolvedColumn = ({ solved }) => (solved ? chalk.green('✓') : '');

/**
 * Generates the text for the attempts column.
 * @private
 */
export const mapAttemptColumns = (completionData, maxAttempts) => {
  let markedMax = false;
  return completionData.map(({ numberOfAttempts, solved }) => {
    if (numberOfAttempts == null) {
      return '';
    }

    // highlight highest number of attempts.
    if (maxAttempts > 1 && numberOfAttempts === maxAttempts) {
      // it's possible multiple puzzles match the max attempt.
      // only add descriptive text to the first match.
      const message = markedMax ? numberOfAttempts : `${numberOfAttempts} (worst)`;
      markedMax = true;
      return chalk.yellow(message);
    }

    // highlight perfect solves
    if (solved && numberOfAttempts === 1) {
      return chalk.green(`${numberOfAttempts}`);
    }

    return `${numberOfAttempts}`;
  });
};

/**
 * Generates the text for the runtime column.
 * @private
 */
export const mapRuntimeColumn = ({ executionTimeNs }, fastest, slowest) => {
  if (executionTimeNs == null || executionTimeNs === '') {
    return '';
  }
  const text = humanizeDuration(executionTimeNs);

  // highlight fastest runtime
  if (fastest > 0 && executionTimeNs === fastest) {
    return chalk.green(`${text} (best)`);
  }

  // highlight slowest runtime
  if (slowest > 0 && executionTimeNs === slowest) {
    return chalk.yellow(`${text} (worst)`);
  }

  return `${text}`;
};

/**
 * Generates the text for the solved count summary row.
 * @private
 */
export const getSolvedMessage = (solvedCount, totalPuzzleCount) => {
  const solvedPercent = (solvedCount / totalPuzzleCount) * 100;

  if (!Number.isFinite(solvedPercent)) {
    throw new Error('could not calculate solved percent from arguments');
  }

  return `Solved ${solvedCount}/${totalPuzzleCount} (${solvedPercent.toFixed()}%)`;
};

/**
 * Generates a table from the data which can be printed to the cli.
 * @param {Object[]} completionData
 */
/* istanbul ignore next */
const generateTable = async (year, completionData) => {
  // grab any extra data we want to display.
  const averageAttempts = await getAverageAttempts(year);
  const averageRuntime = await getAverageRuntime(year);
  const solvedCount = await getSolvedCount(year);
  const totalPuzzleCount = getTotalPuzzleCount();
  // only apply highlighting if more than two puzzles have been solved.
  // with 2 or less it's kind of obvious, there isn't a need to highlight.
  const maxAttempts = completionData.length > 2 ? await getMaxAttempts(year) : null;
  const fastestRuntime = completionData.length > 2 ? await getFastestRuntime(year) : null;
  const slowestRuntime = completionData.length > 2 ? await getSlowestRuntime(year) : null;

  // generate the columns for the puzzle data.
  const names = completionData.map(mapNamedColumn);
  const solved = completionData.map(mapSolvedColumn);
  const attempts = mapAttemptColumns(completionData, maxAttempts);
  const runtimes = completionData.map((x) => mapRuntimeColumn(x, fastestRuntime, slowestRuntime));

  const headerRows = [
    [`Advent of Code ${year}`, '', '', ''],
    ['Puzzle', 'Solved', 'Attempts', 'Runtime'],
  ];
  const puzzleRows = completionData.map(
    (_, index) => [names[index], solved[index], attempts[index], runtimes[index]],
  );
  const summaryRows = [
    ['Average', '', averageAttempts.toFixed(2), humanizeDuration(averageRuntime)],
    [getSolvedMessage(solvedCount, totalPuzzleCount), '', '', ''],
  ];

  const config = {
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

  return table([...headerRows, ...puzzleRows, ...summaryRows], config);
};

/**
 * Outputs a table to the cli which shows the users progress for the year.
 */
export const outputCompletionTable = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }
  const completionData = await getPuzzleCompletionData(year);

  if (completionData.length === 0) {
    logger.festive('You have not submitted any puzzles yet, please run this command after submitting a puzzle');
    return false;
  }

  const result = await generateTable(year, completionData);
  console.log(result);
  return true;
};
