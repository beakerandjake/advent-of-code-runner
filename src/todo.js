/**

  cli specifies args and such but calls separate action functions that's easier tested
  break out function in solutionRunnerWorkerThread & export for testing.
  need to test api, pull out response parsing into own files?

  actions vs commands
    commands are responsible for cli taking input / validation and invoking actions
    actions are responsible for coordinating multiple modules to achieve action
    commands can use one or more actions.

  testing... when mocking async fns, am i returning async fn/promise???
 *
 *
 */
