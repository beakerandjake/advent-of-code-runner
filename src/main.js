/* eslint-disable import/extensions */
import { downloadInput } from './downloadInput.js';
import { inputFileExits, saveInputToFile } from './io.js';
import { getConfigValue } from './config.js';

const year = getConfigValue('aoc.year');
const day = 1;

if (!await inputFileExits(year, day)) {
  const input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
  await saveInputToFile(year, day, input);
}

// await saveInputToFile(2022, 1, z);
