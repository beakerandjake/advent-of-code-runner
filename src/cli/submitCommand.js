import { Command } from 'commander';
import { LockedPuzzleError, PuzzleAlreadySolvedError } from '../errors/index.js';
import { logger } from '../logger.js';
import { puzzleHasBeenSolved } from '../progress.js';
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
    logger.verbose('submitting solution for day: %s, part: %s, year: %s', day, part, year);

    if (!puzzleIsUnlocked(year, day)) {
      throw new LockedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked or already completed!`);
    }

    if (await puzzleHasBeenSolved(year, day, part)) {
      throw new PuzzleAlreadySolvedError(`You have already completed puzzle for year: ${year}, day: ${day}, part: ${part}!`);
    }
  });

export const submitCommand = command;
