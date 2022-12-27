import { LockedOrCompletedPuzzleError } from './lockedOrCompletedPuzzleError.js';
import { PackageInstallFailedError } from './packageInstallFailedError.js';
import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionSyntaxError,
  UserSolutionThrewError,
} from './solutionWorkerErrors.js';
import { UserError } from './userError.js';
import { PuzzleHasBeenSolvedError, DuplicateAnswerSubmittedError } from './submissionErrors.js';
import { RateLimitExceededError, SolvingWrongLevelError } from './apiErrors.js';

export {
  LockedOrCompletedPuzzleError,
  RateLimitExceededError,
  PackageInstallFailedError,
  UserError,

  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionSyntaxError,
  UserSolutionThrewError,

  PuzzleHasBeenSolvedError,
  DuplicateAnswerSubmittedError,
  SolvingWrongLevelError,
};
