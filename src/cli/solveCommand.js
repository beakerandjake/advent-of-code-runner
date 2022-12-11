import { Command } from 'commander';
import { LockedOrCompletedPuzzleError } from '../errors/index.js';
import { logger } from '../logger.js';
import { getCorrectAnswer, tryToSetFastestExecutionTime } from '../progress.js';
import { solve } from '../solve.js';
import { puzzleIsUnlocked } from '../validatePuzzle.js';
import { dayArgument, partArgument, yearOption } from './arguments.js';

const command = new Command();

command
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .addOption(yearOption)
  .action(async (day, part, { year }) => {
    logger.festive('Solving day: %s, part: %s, year: %s', day, part, year);

    if (!puzzleIsUnlocked(year, day)) {
      throw new LockedOrCompletedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked!`);
    }

    const { answer, executionTimeNs } = await solve(year, day, part);

    // if answer is correct answer then update fastest runtime.
    if (await getCorrectAnswer(year, day, part) === answer.toString()) {
      await tryToSetFastestExecutionTime(year, day, part, executionTimeNs);
    }
  });

export const solveCommand = command;
