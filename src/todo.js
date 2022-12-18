/**

  src/

    validation/
      userArgs.js (could rename to  puzzle? add getAllPuzzlesForYear? add isUnlocked? )
        yearIsValid
        dayIsValid
        partIsValid

      userAnswer.js (type)
        answerTypeIsValid - string or number
        answerIsValid -> is valid type and non empty.
        normalizeAnswer -> trim and convert to string.

      puzzle.js (could move to puzzle.js if rename userArgs)
        isUnlocked

      solutions
        solve.js
        solutionRunner
        solutionRunnerWorkerThread

      inputs/
        inputCache.js
        getInput.js

      where to put getAllPuzzlesForYear?? need a better name

  cli specifies args and such but calls separate action functions that's easier tested
  break out function in solutionRunnerWorkerThread & export for testing.
  need to test api, pull out response parsing into own files?

  need one interface for input that downloads and caches if not found..

  testing... when mocking async fns, am i returning async fn/promise???
 *
 *
 */
