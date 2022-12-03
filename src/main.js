import { downloadInput } from './downloadInput.js';
import { inputFileExits, saveInputToFile, loadInputFile } from './io.js';
import { getConfigValue } from './config.js';

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

// await saveInputToFile(2022, 1, z);
