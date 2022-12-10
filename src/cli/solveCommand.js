import { Command } from 'commander';
import { LockedOrCompletedPuzzleError } from '../errors/index.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
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

    const { solution, executionTimeNs } = await solve(year, day, part);

    logger.festive('Solution: %s (solved in %s)', solution, humanizeDuration(executionTimeNs));
  });

export const solveCommand = command;
