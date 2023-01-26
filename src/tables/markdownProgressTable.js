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
 * Creates a markdown table row for the values.
 * @private
 */
export const tr = (values) => `| ${values.join(' | ')} |`;

/**
 * Wraps the value with markdown to stylize as italic.
 * @private
 */
export const italic = (value) => `*${value}*`;

/**
 * Wraps the value with markdown to stylize as bold.
 * @private
 */
export const bold = (value) => `**${value}**`;

/**
 * Generates the text for the name column.
 * @private
 */
export const mapNameColumn = ({ day, level }) => `${day}.${level}`;

/**
 * Generates the text for the solved column.
 * @private
 */
export const mapSolvedColumn = ({ solved }) => (solved ? '✓' : '');

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

  // generate the columns of the table from the puzzle data.
  const names = completionData.map(mapNameColumn);
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
 * Returns a header for the section in the readme
 * @private
 */
export const generateHeader = async (year) => {
  const solvedCount = await getSolvedCount(year);
  const totalPuzzleCount = getTotalPuzzleCount();
  const solvedPercent = (solvedCount / totalPuzzleCount) * 100;

  if (!Number.isFinite(solvedPercent)) {
    throw new Error('could not calculate solved percent from arguments');
  }

  return `## Completion Progress - ${solvedCount}/${totalPuzzleCount} (${solvedPercent.toFixed()}%)`;
};

/**
 * Generates a progress table using markdown syntax.
 * @param {Number} year
 * @param {Object[]} completionData
 */
export const generateMarkdownProgressTable = async (year, completionData) => [
  await generateHeader(year),
  await generateTable(year, completionData),
].join('\n\n');