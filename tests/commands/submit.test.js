import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import {
  AnswerAlreadySubmittedError,
  PuzzleAlreadyCompletedError,
} from '../../src/errors/puzzleErrors.js';

// setup mocks
const easyMocks = [
  [
    'src/answers.js',
    [
      'addIncorrectAnswer',
      'answerHasBeenSubmitted',
      'getNextUnansweredPuzzle',
      'puzzleHasBeenSolved',
      'setCorrectAnswer',
    ],
  ],
  ['src/api/index.js', ['postAnswer']],
  ['src/api/parsePostAnswerResponse.js', ['parsePostAnswerResponse']],
  ['src/persistence/metaRepository.js', ['getYear', 'getAuthToken']],
  ['src/statistics.js', ['setPuzzlesFastestRuntime']],
  ['src/validation/userFilesExist.js', ['dataFileExists']],
  ['src/commands/solve.js', ['tryToSolvePuzzle']],
  ['src/tables/autoUpdateReadme.js', ['autoUpdateReadme']],
];
easyMock(easyMocks);
mockLogger();

// import after mocks set up.
const {
  dataFileExists,
  getNextUnansweredPuzzle,
  puzzleHasBeenSolved,
  tryToSolvePuzzle,
  postAnswer,
  parsePostAnswerResponse,
  getYear,
  answerHasBeenSubmitted,
  addIncorrectAnswer,
  setCorrectAnswer,
  setPuzzlesFastestRuntime,
  autoUpdateReadme,
} = await easyResolve(easyMocks);
const { submitAction } = await import('../../src/commands/submit.js');

describe('submit command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws if not initialized', async () => {
    dataFileExists.mockResolvedValue(false);
    await expect(() => submitAction()).rejects.toThrow();
  });

  test('auto submits if no args', async () => {
    const year = 1243;
    const day = 10;
    const level = 1;
    getYear.mockReturnValue(year);
    getNextUnansweredPuzzle.mockResolvedValue({ day, level });
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({ correct: true, message: '' });
    await submitAction();
    expect(getNextUnansweredPuzzle).toHaveBeenCalled();
    expect(tryToSolvePuzzle).toHaveBeenCalledWith(year, day, level);
  });

  test('does not auto submit if day provided', async () => {
    dataFileExists.mockResolvedValue(true);
    getYear.mockReturnValue(1234);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({ correct: true, message: '' });
    await submitAction(1);
    expect(getNextUnansweredPuzzle).not.toHaveBeenCalled();
  });

  test('solves with level 1 if not provided', async () => {
    const day = 2;
    getYear.mockReturnValue(1231);
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({ correct: true, message: '' });
    await submitAction(2);
    expect(tryToSolvePuzzle).toHaveBeenCalledWith(expect.any(Number), day, 1);
  });

  test('solves with day and level if both provided', async () => {
    const day = 2;
    const level = 1;
    getYear.mockReturnValue(123);
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({ correct: true, message: '' });
    await submitAction(2);
    expect(tryToSolvePuzzle).toHaveBeenCalledWith(
      expect.any(Number),
      day,
      level
    );
  });

  test('does not auto submit if all puzzles have been solved', async () => {
    dataFileExists.mockResolvedValue(true);
    getNextUnansweredPuzzle.mockResolvedValue(null);
    await submitAction();
    expect(tryToSolvePuzzle).not.toHaveBeenCalled();
    expect(postAnswer).not.toHaveBeenCalled();
  });

  test('throws if puzzle has already been solved', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(true);
    await expect(() => submitAction(1, 2)).rejects.toThrow(
      PuzzleAlreadyCompletedError
    );
  });

  test('throws if answer already submitted', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    answerHasBeenSubmitted.mockResolvedValue(true);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    await expect(() => submitAction(1, 2)).rejects.toThrow(
      AnswerAlreadySubmittedError
    );
  });

  test('stores incorrect answer if answer is not correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: false,
      message: 'wrong!',
    });
    await submitAction(1, 2);
    expect(addIncorrectAnswer).toHaveBeenCalled();
  });

  test('does not set correct answer if answer is not correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: false,
      message: 'wrong!',
    });
    await submitAction(1, 2);
    expect(setCorrectAnswer).not.toHaveBeenCalled();
  });

  test('does not set fastest runtime if answer is not correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: false,
      message: 'wrong!',
    });
    await submitAction(1, 2);
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('does not update readme if answer is not correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: false,
      message: 'wrong!',
    });
    await submitAction(1, 2);
    expect(autoUpdateReadme).not.toHaveBeenCalled();
  });

  test('does not store incorrect answer if answer is correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: true,
      message: 'great!',
    });
    await submitAction(1, 2);
    expect(addIncorrectAnswer).not.toHaveBeenCalled();
  });

  test('sets correct answer if answer is correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: true,
      message: 'great!',
    });
    await submitAction(1, 2);
    expect(setCorrectAnswer).toHaveBeenCalled();
  });

  test('sets fastest runtime if answer is correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: true,
      message: 'great!',
    });
    await submitAction(1, 2);
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });

  test('updates readme if answer is correct', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasBeenSolved.mockResolvedValue(false);
    tryToSolvePuzzle.mockResolvedValue({ answer: 'great job!', runtimeNs: 5 });
    postAnswer.mockResolvedValue('asdf');
    parsePostAnswerResponse.mockResolvedValue({
      correct: true,
      message: 'great!',
    });
    await submitAction(1, 2);
    expect(autoUpdateReadme).toHaveBeenCalled();
  });
});
