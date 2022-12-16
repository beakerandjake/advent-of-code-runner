import { Command } from 'commander';
import { answersEqual, getCorrectAnswer } from '../answers.js';
import { LockedOrCompletedPuzzleError } from '../errors/index.js';
import { logger } from '../logger.js';
import { solve } from '../solve.js';
import { tryToSetFastestExecutionTime } from '../statistics.js';
import { puzzleIsUnlocked } from '../validatePuzzle.js';
import { dayArgument, partArgument, yearOption } from './arguments.js';

export const solveCommand = new Command()
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .addOption(yearOption)
  .action(async (day, part, { year }) => {
    logger.festive('Solving day: %s, part: %s, year: %s', day, part, year);

    if (!puzzleIsUnlocked(year, day)) {
      throw new LockedOrCompletedPuzzleError();
    }

    const { answer, executionTimeNs } = await solve(year, day, part);

    // the user might have already submitted the correct answer to this problem
    // but are re-executing their solution because they made code or performance improvements.
    const correctAnswer = await getCorrectAnswer(year, day, part);

    // the user has not previously submitted a correct answer.
    if (!correctAnswer) {
      return;
    }

    // the current answer is not the correct answer.
    // the user could have changed code and broke something.
    if (answersEqual(answer, correctAnswer)) {
      logger.error('You have already correctly answered this puzzle, but answer: "%s" doesn\'t match correct answer: "%s"', answer, correctAnswer);
      return;
    }

    // the current answer is correct, see if the user broke a performance record.
    logger.festive('You have already correctly answered this puzzle');
    await tryToSetFastestExecutionTime(year, day, part, executionTimeNs);
  });
