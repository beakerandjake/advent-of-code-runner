// import { Command } from 'commander';
// import { submitSolution } from '../api/index.js';
// import { getConfigValue } from '../config.js';
// import { LockedPuzzleError } from '../errors/index.js';
// import { logger } from '../logger.js';
// import { solve } from '../solutions/index.js';
// import { puzzleIsUnlocked } from '../validation/validatePuzzle.js';
// import { dayArgument, partArgument } from './arguments.js';
// import {
//   puzzleHasBeenSolved,
//   setCorrectAnswer,
//   addIncorrectAnswer,
//   answerHasBeenSubmitted,
// } from '../answers.js';
// import { getInput } from '../inputs/getInput.js';

// /**
//  * Solve the puzzle and submit the solution to advent of code.
//  * @param {Number} day
//  * @param {Number} part
//  * @param {Object} options
//  * @param {Number} options.year
//  */
// const submit = async (day, part) => {
//   const year = getConfigValue('aoc.year');

//   logger.festive('Submitting day: %s, part: %s, year: %s', day, part, year);

//   // prevent submission if user can't even submit.
//   if (!puzzleIsUnlocked(year, day)) {
//     throw new LockedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked or already completed!`);
//   }

//   // prevent submission if we know user already solved this puzzle.
//   if (await puzzleHasBeenSolved(year, day, part)) {
//     logger.festive('You\'ve already submitted a correct solution to this puzzle!');
//     return;
//   }

//   const { answer, executionTimeNs } = (
//     await solve(day, part, await getInput(year, day))
//   );

//   if (await answerHasBeenSubmitted(year, day, part, answer)) {
//     logger.error('You\'ve already submitted this incorrect answer to advent of code!');
//     return;
//   }

//   logger.festive('Posting solution to adventofcode');

//   const { success, message } = await submitSolution(year, day, part, answer, getConfigValue('aoc.authenticationToken'));

//   logger[success ? 'festive' : 'error']('%s', message);

//   const progressUpdate = success
//     ? setCorrectAnswer(year, day, part, answer, executionTimeNs)
//     : addIncorrectAnswer(year, day, part, answer);

//   await progressUpdate;
// };

// /**
//  * Command which allows the user to submit a puzzles answer to advent of code.
//  */
// export const submitCommand = new Command()
//   .name('submit')
//   .description('Run the solution for the puzzle, then submit the result.')
//   .addArgument(dayArgument)
//   .addArgument(partArgument)
//   .action(submit);
