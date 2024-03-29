import {
  addIncorrectAnswer,
  answerHasBeenSubmitted,
  getNextUnansweredPuzzle,
  puzzleHasBeenSolved,
  setCorrectAnswer,
} from '../answers.js';
import { postAnswer } from '../api/index.js';
import { parsePostAnswerResponse } from '../api/parsePostAnswerResponse.js';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import {
  AnswerAlreadySubmittedError,
  PuzzleAlreadyCompletedError,
} from '../errors/puzzleErrors.js';
import { logger } from '../logger.js';
import { getAuthToken, getYear } from '../persistence/metaRepository.js';
import { setPuzzlesFastestRuntime } from '../statistics.js';
import { autoUpdateReadme } from '../tables/autoUpdateReadme.js';
import { dataFileExists } from '../validation/userFilesExist.js';
import { tryToSolvePuzzle } from './solve.js';

/**
 * Submit a specific puzzle
 */
const submit = async (year, day, level) => {
  logger.debug('submit puzzle year: %s, day: %s, level: %s', year, day, level);
  if (await puzzleHasBeenSolved(year, day, level)) {
    throw new PuzzleAlreadyCompletedError(day, level);
  }

  const { answer, runtimeNs } = await tryToSolvePuzzle(year, day, level);
  if (await answerHasBeenSubmitted(year, day, level, answer)) {
    throw new AnswerAlreadySubmittedError();
  }
  const response = await postAnswer(year, day, level, answer, getAuthToken());
  const { correct, message } = await parsePostAnswerResponse(response);

  if (!correct) {
    logger.error(message);
    await addIncorrectAnswer(year, day, level, answer);
  } else {
    logger.festive(message);
    await setCorrectAnswer(year, day, level, answer);
    await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
    await autoUpdateReadme();
  }
};

/**
 * Submit the next unsolved puzzle based on users progress.
 */
const autoSubmit = async (year) => {
  logger.debug('no args provided, running auto submit');
  const next = await getNextUnansweredPuzzle(year);
  if (!next) {
    logger.festive(
      'Congratulations, you solved all the puzzles this year! There are no more puzzles left to submit. If you want to solve a specific puzzle use the "solve [day] [level]" instead.'
    );
    return;
  }
  logger.debug('auto submit chose day: %s, level: %s', next.day, next.level);
  await submit(year, next.day, next.level);
};

/**
 * Command to execute and submit the answer for a specific puzzle.
 * @param {number} day
 * @param {number} level
 */
export const submitAction = async (day, level) => {
  logger.debug('starting submit action: [day]=%s, [level]=%s', day, level);
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }
  if (!day && !level) {
    await autoSubmit(await getYear());
  } else {
    await submit(await getYear(), day, level || 1);
  }
};
