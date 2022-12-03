import { downloadInput } from './downloadInput.js';
import { logger } from './logger.js';
import { inputFileExits, saveInputToFile } from './io.js';

const year = process.env.AOC_YEAR || 2022;
const day = 1;

if (!await inputFileExits(year, day)) {
    const input = await downloadInput(year, day, process.env.AOC_AUTHENTICATION_TOKEN);
    await saveInputToFile(year, day, input);
}

//await saveInputToFile(2022, 1, z);
