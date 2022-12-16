import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { AnswerTypeInvalidError, AnswerEmptyError } from '../src/errors/index.js';

// setup mocks.
jest.unstable_mockModule('../src/persistence/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
  createPuzzle: jest.fn(),
  addOrEditPuzzle: jest.fn(),
}));

jest.unstable_mockModule('../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

// import after setting up the mock so the modules import the mocked version
const { findPuzzle, createPuzzle, addOrEditPuzzle } = await import('../src/persistence/puzzleRepository.js');
const {
  puzzleHasBeenSolved,
  getCorrectAnswer,
  setCorrectAnswer,
  parseAnswer,
  addIncorrectAnswer,
  answerHasBeenSubmitted,
} = await import('../src/answers.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('answers', () => {
  describe('puzzleHasBeenSolved()', () => {
    test('returns false if puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      expect(await puzzleHasBeenSolved(2022, 1, 1)).toBe(false);
    });

    test('returns true if puzzle has correctAnswer set', async () => {
      findPuzzle.mockReturnValueOnce({
        correctAnswer: 'bobcat',
      });
      expect(await puzzleHasBeenSolved(2022, 12, 1)).toBe(true);
    });

    test('returns false if puzzle does not have correctAnswer set', async () => {
      findPuzzle.mockReturnValueOnce({
        correctAnswer: null,
      });
      expect(await puzzleHasBeenSolved(2022, 12, 1)).toBe(false);
    });
  });

  describe('getCorrectAnswer()', () => {
    test('returns null if puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      expect(await getCorrectAnswer(2022, 1, 1)).toBe(null);
    });

    test('returns correctAnswer if puzzle found', async () => {
      const correctAnswer = 'ASDF';
      findPuzzle.mockReturnValueOnce({ correctAnswer });
      expect(await getCorrectAnswer(2022, 1, 1)).toBe(correctAnswer);
    });
  });

  describe('parseAnswer()', () => {
    test('throws on null', () => {
      expect(() => parseAnswer(null)).toThrow(AnswerEmptyError);
    });

    test('throws on undefined', () => {
      expect(() => parseAnswer(null)).toThrow(AnswerEmptyError);
    });

    test('throws on invalid type', () => {
      expect(() => parseAnswer([])).toThrow(AnswerTypeInvalidError);
      expect(() => parseAnswer(false)).toThrow(AnswerTypeInvalidError);
      expect(() => parseAnswer({})).toThrow(AnswerTypeInvalidError);
      expect(() => parseAnswer(Promise.resolve('ASDF'))).toThrow(AnswerTypeInvalidError);
      expect(() => parseAnswer(() => {})).toThrow(AnswerTypeInvalidError);
      expect(() => parseAnswer(new Error('WRONG'))).toThrow(AnswerTypeInvalidError);
    });

    test('throws on empty string', () => {
      expect(() => parseAnswer('')).toThrow(AnswerEmptyError);
    });

    test('throws on whitespace', () => {
      expect(() => parseAnswer('\t\t\t\t\t')).toThrow(AnswerEmptyError);
      expect(() => parseAnswer('\r\n')).toThrow(AnswerEmptyError);
      expect(() => parseAnswer('     ')).toThrow(AnswerEmptyError);
    });

    test('trims a string answer', () => {
      const answer = '\tASDF\t   ';
      const trimmed = answer.trim();
      expect(parseAnswer(answer)).toEqual(trimmed);
    });

    test('accepts a string answer', () => {
      const answer = 'ASDF';
      expect(parseAnswer(answer)).toEqual(answer);
    });

    test('accepts a number answer', () => {
      const answer = 123412341234;
      const expected = answer.toString();
      expect(parseAnswer(answer)).toEqual(expected);
    });
  });

  describe('setCorrectAnswer()', () => {
    test('creates puzzle called if puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      createPuzzle.mockReturnValueOnce({});
      await setCorrectAnswer(2022, 1, 1, 'asdf');
      expect(createPuzzle).toBeCalled();
    });

    test('sets correct answer', async () => {
      const correctAnswer = 'asdf';
      findPuzzle.mockReturnValueOnce({ correctAnswer: null });
      await setCorrectAnswer(2022, 1, 1, correctAnswer);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ correctAnswer });
    });

    test('only changes correctAnswer field', async () => {
      const correctAnswer = 'NEW ANSWER';
      const originalData = {
        id: '20220101',
        correctAnswer: null,
        incorrectAnswers: ['asdf', '1234'],
        fastestExecutionTimeNs: null,
      };
      findPuzzle.mockReturnValueOnce(originalData);
      await setCorrectAnswer(2022, 1, 1, correctAnswer);
      console.log(addOrEditPuzzle.mock);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ ...originalData, correctAnswer });
    });
  });

  describe('addIncorrectAnswer()', () => {
    test('creates puzzle called if puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      createPuzzle.mockReturnValueOnce({ incorrectAnswers: [] });
      await addIncorrectAnswer(2022, 1, 1, 'asdf');
      expect(createPuzzle).toBeCalled();
    });

    test('pushes to empty incorrectAnswers array', async () => {
      const toAdd = 'ASDF';
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: [] });
      await addIncorrectAnswer(2022, 1, 1, toAdd);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ incorrectAnswers: [toAdd] });
    });

    test('pushes to non-empty incorrectAnswers array', async () => {
      const orig = ['cool', 'guy', 'present'];
      const toAdd = 'ASDF';
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: orig });
      await addIncorrectAnswer(2022, 1, 1, toAdd);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({ incorrectAnswers: [...orig, toAdd] });
    });

    test('handles duplicate incorrect answer (exact match)', async () => {
      const orig = ['cool', 'guy'];
      const toAdd = orig[0];
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: orig });
      await addIncorrectAnswer(2022, 1, 1, toAdd);
      expect(addOrEditPuzzle).not.toHaveBeenCalled();
    });

    test('handles duplicate incorrect answer (case insensitive)', async () => {
      const orig = ['COOL', 'guy'];
      const toAdd = orig[0].toLowerCase();
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: orig });
      await addIncorrectAnswer(2022, 1, 1, toAdd);
      expect(addOrEditPuzzle).not.toHaveBeenCalled();
    });

    test('only changes incorrectAnswer field', async () => {
      const toAdd = 'NEW ANSWER';
      const originalData = {
        id: '20220101',
        correctAnswer: 'GOOD JOB',
        incorrectAnswers: ['adsf', 'qwer'],
        fastestExecutionTimeNs: 12341234,
      };
      findPuzzle.mockReturnValueOnce(originalData);
      await addIncorrectAnswer(2022, 1, 1, toAdd);
      expect(addOrEditPuzzle).toHaveBeenCalledWith({
        ...originalData,
        incorrectAnswers: [...originalData.incorrectAnswers, toAdd],
      });
    });
  });

  describe('answerHasBeenSubmitted()', () => {
    test('returns false if puzzle does not exist', async () => {
      findPuzzle.mockReturnValueOnce(null);
      expect(await answerHasBeenSubmitted(2022, 1, 1, 'asdf')).toEqual(false);
    });

    test('returns false if no answers submitted', async () => {
      const answer = 'asdf';
      findPuzzle.mockReturnValueOnce({ correctAnswer: null, incorrectAnswers: [] });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(false);
    });

    test('returns false if not not submitted', async () => {
      const answer = 'asdf';
      findPuzzle.mockReturnValueOnce({ correctAnswer: 'cool guy', incorrectAnswers: ['1234', 'zxcv', 'qwer'] });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(false);
    });

    test('returns true if answer is correct answer', async () => {
      const answer = 'asdf';
      findPuzzle.mockReturnValueOnce({ correctAnswer: answer });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(true);
    });

    test('returns true if answer is correct answer (ignores case)', async () => {
      const answer = 'ANSWER';
      findPuzzle.mockReturnValueOnce({ correctAnswer: answer.toLowerCase() });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(true);
    });

    test('returns true if answer is an incorrect answer', async () => {
      const answer = 'asdf';
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: ['1234', 'zxcv', 'qwer', answer] });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(true);
    });

    test('returns true if answer is an incorrect answer (ignores case)', async () => {
      const answer = 'asdf';
      findPuzzle.mockReturnValueOnce({ incorrectAnswers: ['1234', 'zxcv', 'qwer', answer.toUpperCase()] });
      expect(await answerHasBeenSubmitted(2022, 1, 1, answer)).toEqual(true);
    });
  });
});
