import { Command } from 'commander';
import { LockedPuzzleError, PuzzleAlreadySolvedError } from '../errors/index.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
import { puzzleHasBeenSolved } from '../progress.js';
import { solve } from '../solve.js';
import { puzzleIsUnlocked } from '../validatePuzzle.js';
import { dayArgument, partArgument, yearOption } from './arguments.js';

const command = new Command();

command
  .name('submit')
  .description('Run the solution for the puzzle, then submit the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .addOption(yearOption)
  .action(async (day, part, { year }) => {
    logger.verbose('executing submit command with args: <day> %s, <part> %s, -y %s', day, part, year);

    if (!puzzleIsUnlocked(year, day)) {
      throw new LockedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked or already completed!`);
    }

    if (await puzzleHasBeenSolved(year, day, part)) {
      throw new PuzzleAlreadySolvedError(`You have already completed puzzle for year: ${year}, day: ${day}, part: ${part}!`);
    }
    const { solution, executionTimeNs } = await solve(year, day, part);

    logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));
  });

export const submitCommand = command;
