/**
 * 2. create all answer objects upfront?
 *        pros: no creation, less code, easy queries, sorted correctly
 *        cons: if user edits aocr-data.json then everything breaks, bigger storage size
 *
 *        pros: creation, user data is in order of solving, stores only whats needed
 *        cons: have to add creation...
 *
 what about file structure of

  src/
    persistence/
      -io.js
      -jsonFileStore.js
      -userAnswersRepository.js
      -userRateLimitRepository.js

    answers/
        -puzzleHasBeenSolved.js
      -getCorrectAnswer.js
      -setCorrectAnswer.js
      -answerHasBeenSubmitted.js
      -getCorrectAnswer.js
      -getNextUnansweredPuzzle.js
      -index.js - exports all functions as named or exports into named answerService object?

    statistics/
      -getPercentOfYearCompleted.js
      -getFastestExecutionTime.js
      -setFastestExecutionTime.js
      -getPercentCompleteOnFirstTry.js
      -getMostFailedAttemptsCount.js
      -index.js - exports all functions as named or exports into named statsService object?

    progress/ 
      getNextUnansweredPuzzle.js
      

    api/
      ...
      rateLimiting.js

   -- add tests for all above.

 *
 *
 */

/**
 * Attempt to update the fastest execution time for this puzzle.
 * The fastest time will only be updated if the puzzle has a correct answer set
 * and the provided execution time is smaller than the current fastest time.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number} executionTimeNs
 */
export const tryToSetFastestExecutionTime = async (year, day, part, executionTimeNs) => {
  logger.debug('trying to set fastest execution time for year: %s, day: %s, part: %s', year, day, part);

  if (!Number.isFinite(executionTimeNs)) {
    throw new Error('Attempted to set fastest execution time to non numeric value');
  }

  const puzzles = await getPuzzles();
  const puzzle = findPuzzle(puzzleId(year, day, part), puzzles);

  // bail if puzzle has not been solved
  if (!puzzle?.correctAnswer) {
    logger.debug('not setting fastest execution time, puzzle has not been successfully answered.');
    return;
  }

  // bail if execution time was too slow
  if (puzzle.fastestExecutionTimeNs <= executionTimeNs) {
    logger.debug('not setting fastest execution time, execution time: %s was slower than stored fastest: %s', executionTimeNs, puzzle.fastestExecutionTimeNs);
    return;
  }

  logger.festive('That\'s your fastest execution time ever for this puzzle!');
  const changes = { ...puzzle, fastestExecutionTimeNs: executionTimeNs };
  await setPuzzles(addOrUpdatePuzzle(changes, puzzles));
};

