import { pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import {
  getAverageAttempts,
  getAverageRuntime,
  getFastestRuntime, getMaxAttempts, getPuzzleCompletionData, getSlowestRuntime,
} from '../statistics.js';
import { humanizeDuration } from '../formatting.js';

const tr = (values) => `| ${values.join(' | ')} |`;
const italic = (value) => `*${value}*`;
const bold = (value) => `**${value}**`;

/**
 * Generates the text for the name column.
 * @private
 */
export const mapNamedColumn = ({ day, level }) => `${day}.${level}`;

/**
 * Generates the text for the solved column.
 * @private
 */
export const mapSolvedColumn = ({ solved }) => (solved ? '✓' : '');

/**
 * Generates the text for the attempt column.
 * @private
 */
export const mapAttemptColumn = ({ numberOfAttempts }) => `${numberOfAttempts}`;

/**
 * Generates the text for the attempts column.
 * @private
 */
export const mapAttemptColumns = (completionData, maxAttempts) => {
  let markedMax = false;
  return completionData.map(({ numberOfAttempts }) => {
    if (numberOfAttempts == null) {
      return '';
    }

    // highlight highest number of attempts.
    if (maxAttempts > 1 && numberOfAttempts === maxAttempts) {
      // it's possible multiple puzzles match the max attempt.
      // only add descriptive text to the first match.
      const message = markedMax ? numberOfAttempts : `${numberOfAttempts} (worst)`;
      markedMax = true;
      return bold(italic((message)));
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
    return bold(italic(`${text} (best)`));
  }

  // highlight slowest runtime
  if (slowest > 0 && runtimeNs === slowest) {
    return bold(italic(`${text} (worst)`));
  }

  return `${text}`;
};

/**
 * Generates a markdown table from the years data.
 */
const generateTable = async (year, completionData) => {
  const averageAttempts = await getAverageAttempts(year);
  const averageRuntime = await getAverageRuntime(year);
  // only apply highlighting if more than two puzzles have been solved.
  // with 2 or less it's kind of obvious, there isn't a need to highlight.
  const maxAttempts = completionData.length > 2 ? await getMaxAttempts(year) : null;
  const fastestRuntime = completionData.length > 2 ? await getFastestRuntime(year) : null;
  const slowestRuntime = completionData.length > 2 ? await getSlowestRuntime(year) : null;

  const names = completionData.map(mapNamedColumn);
  const solved = completionData.map(mapSolvedColumn);
  const attempts = mapAttemptColumns(completionData, maxAttempts);
  const runtimes = completionData.map((x) => mapRuntimeColumn(x, fastestRuntime, slowestRuntime));

  const headerRows = [
    ['Puzzle', 'Solved', 'Attempts', 'Runtime'],
    ['---', '---', '---', '---'],
  ].map(tr);
  const puzzleRows = completionData.map(
    (_, index) => tr([names[index], solved[index], attempts[index], runtimes[index]]),
  );
  const averageRow = tr(['', bold('Average'), averageAttempts.toFixed(2), humanizeDuration(averageRuntime)]);

  return [...headerRows, ...puzzleRows, averageRow].join('\n');
};

/**
 * Saves a table to the users readme which shows the users progress for the year.
 */
export const saveCompletionTableToReadme = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }

  const completionData = await getPuzzleCompletionData(year);

  if (completionData.length === 0) {
    logger.festive('You have not submitted any puzzles yet, please run this command after submitting a puzzle');
    return false;
  }

  const tableText = await generateTable(year, completionData);

  console.log(tableText);
  return true;
};
