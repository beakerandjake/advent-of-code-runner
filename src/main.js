import { downloadInput } from './downloadInput.js';
import { inputFileExits, saveInputToFile, loadInputFile } from './io.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { solve } from './solve.js';
import { humanizeDuration } from './utils.js';

const year = getConfigValue('aoc.year');
const day = 1;

let input;

if (!await inputFileExits(year, day)) {
  // download and cache input when it doesn't exist.
  input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
  await saveInputToFile(year, day, input);
} else {
  // load cached input instead of re-downloading.
  input = await loadInputFile(year, day);
}

const result = await solve(year, day, input);

logger.info('solution: %s solved in: %s', result.solution, humanizeDuration(result.executionTimeNs));

// 2022_day_1.js

// 2022 / day_1.js
// 2022_day_1.js