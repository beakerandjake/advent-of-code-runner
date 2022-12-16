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
