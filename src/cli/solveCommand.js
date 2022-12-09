import {
  Argument, Command, InvalidArgumentError, Option,
} from 'commander';
import { getConfigValue } from '../config.js';
import { LockedOrCompletedPuzzleError } from '../errors/LockedOrCompletedPuzzleError.js';
import { humanizeDuration, betweenMessage } from '../formatting.js';
import { getInputFileContents } from '../input.js';
import { logger } from '../logger.js';
import { solve } from '../solve.js';
import {
  dayIsValid, partIsValid, puzzleIsUnlocked, yearIsValid,
} from '../validatePuzzle.js';
import { parseIntArg } from './argHelpers.js';

const days = getConfigValue('aoc.puzzleValidation.days');
const parts = getConfigValue('aoc.puzzleValidation.parts');
const years = getConfigValue('aoc.puzzleValidation.years');

const dayArgument = new Argument('<day>', `The day to solve (${betweenMessage(days)}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!dayIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Days between ${betweenMessage(days)}.`);
    }
    return parsed;
  });

const partArgument = new Argument('<part>', `The part of the day to solve (${betweenMessage(parts)}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!partIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Parts ${betweenMessage(parts)}.`);
    }
    return parsed;
  });

const yearOption = new Option('-y, --year <number>', `The year of advent of code to solve (${betweenMessage(years)}).`)
  .argParser((value) => {
    const parsed = parseIntArg(value);
    if (!yearIsValid(parsed)) {
      throw new InvalidArgumentError(`Allowed Years ${betweenMessage(parts)}.`);
    }
    return parsed;
  })
  .default(getConfigValue('aoc.year'));

const command = new Command();

command
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .addOption(yearOption)
  .action(async (day, part, { year }) => {
    logger.verbose('solving day: %s, part: %s, year: %s', day, part, year);

    if (!puzzleIsUnlocked(year, day)) {
      throw new LockedOrCompletedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked!`);
    }

    const input = await getInputFileContents(year, day);

    const { solution, executionTimeNs } = await solve(year, day, part, input);

    logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));
  });

export const solveCommand = command;
