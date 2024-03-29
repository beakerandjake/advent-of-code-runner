import chalk from 'chalk';
import { table } from 'table';
import { humanizeDuration } from '../formatting.js';
import {
  getAverageAttempts,
  getAverageRuntime,
  getFastestRuntime,
  getMaxAttempts,
  getSlowestRuntime,
  getSolvedCount,
} from '../statistics.js';
import { getTotalPuzzleCount } from '../validation/validatePuzzle.js';

/**
 * Generates the text for the name column.
 * @private
 */
export const mapNamedColumn = ({ day, level, solved }) => {
  const text = `${day}.${level}`;
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
      const message = markedMax
        ? numberOfAttempts
        : `${numberOfAttempts} (worst)`;
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
export const mapRuntimeColumn = ({ runtimeNs }, fastest, slowest) => {
  if (runtimeNs == null || runtimeNs === '') {
    return '';
  }
  const text = humanizeDuration(runtimeNs);

  // highlight fastest runtime
  if (fastest > 0 && runtimeNs === fastest) {
    return chalk.green(`${text} (best)`);
  }

  // highlight slowest runtime
  if (slowest > 0 && runtimeNs === slowest) {
    return chalk.yellow(`${text} (worst)`);
  }

  return `${text}`;
};

/**
 * Generates a row for each of the years puzzles.
 * @private
 */
export const generatePuzzleRows = async (year, completionData) => {
  // only apply highlighting if more than two puzzles have been solved.
  // with 2 or less it's kind of obvious, there isn't a need to highlight.
  const maxAttempts =
    completionData.length > 2 ? await getMaxAttempts(year) : null;
  const fastestRuntime =
    completionData.length > 2 ? await getFastestRuntime(year) : null;
  const slowestRuntime =
    completionData.length > 2 ? await getSlowestRuntime(year) : null;

  // generate the columns for the puzzle data.
  const names = completionData.map(mapNamedColumn);
  const solved = completionData.map(mapSolvedColumn);
  const attempts = mapAttemptColumns(completionData, maxAttempts);
  const runtimes = completionData.map((x) =>
    mapRuntimeColumn(x, fastestRuntime, slowestRuntime)
  );

  return completionData.map((_, index) => [
    names[index],
    solved[index],
    attempts[index],
    runtimes[index],
  ]);
};

/**
 * Returns a row which summarizes the years average.
 * @private
 */
export const getAverageRow = async (year) => {
  const averageAttempts = await getAverageAttempts(year);
  const averageRuntime = await getAverageRuntime(year);
  return [
    'Average',
    '',
    averageAttempts.toFixed(2),
    humanizeDuration(averageRuntime),
  ];
};

/**
 * Returns a row which summarizes the percentage of puzzles solved.
 */
export const getSolvedRow = async (year) => {
  const solvedCount = await getSolvedCount(year);
  const totalPuzzleCount = getTotalPuzzleCount();
  const solvedPercent = (solvedCount / totalPuzzleCount) * 100;

  if (!Number.isFinite(solvedPercent)) {
    throw new Error('could not calculate solved percent from arguments');
  }

  return [
    `Solved ${solvedCount}/${totalPuzzleCount} (${solvedPercent.toFixed()}%)`,
    '',
    '',
    '',
  ];
};

/**
 * Generates a table from the data which can be printed to the cli.
 * @param {Object[]} completionData
 */
export const stdoutTable = async (year, completionData) => {
  const headerRows = [
    [`Advent of Code ${year}`, '', '', ''],
    ['Puzzle', 'Solved', 'Attempts', 'Runtime'],
  ];
  const puzzleRows = await generatePuzzleRows(year, completionData);
  const averageRow = await getAverageRow(year);
  const solvedRow = await getSolvedRow(year);

  const config = {
    columnDefault: { alignment: 'left' },
    columns: [{ alignment: 'right' }, { alignment: 'center' }],
    spanningCells: [
      // Header Row
      {
        col: 0,
        row: 0,
        colSpan: 4,
        alignment: 'center',
      },
      // Average Row
      { col: 0, row: headerRows.length + puzzleRows.length, colSpan: 2 },
      // Solved Row
      {
        col: 0,
        row: 1 + headerRows.length + puzzleRows.length,
        colSpan: 4,
        alignment: 'center',
      },
    ],
    // don't draw lines between puzzle rows (makes table more compact)
    drawHorizontalLine: (lineIndex) =>
      lineIndex <= headerRows.length ||
      lineIndex >= headerRows.length + puzzleRows.length,
  };

  return table([...headerRows, ...puzzleRows, averageRow, solvedRow], config);
};
