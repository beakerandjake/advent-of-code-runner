import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from './mocks.js';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/persistence/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
  createPuzzle: jest.fn(),
  addOrEditPuzzle: jest.fn(),
  getPuzzles: jest.fn(),
}));

jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({
  getAllPuzzlesForYear: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version

const { getAllPuzzlesForYear } = await import('../src/validation/validatePuzzle.js');
const {
  findPuzzle, createPuzzle, addOrEditPuzzle, getPuzzles,
} = await import('../src/persistence/puzzleRepository.js');
const {
  puzzleHasBeenSolved,
  getCorrectAnswer,
  setCorrectAnswer,
  parseAnswer,
  addIncorrectAnswer,
  answerHasBeenSubmitted,
  getNextUnansweredPuzzle,
  answersEqual,
  requiredLevelsHaveBeenSolved,
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
      expect(() => parseAnswer(null)).toThrow(TypeError);
    });

    test('throws on undefined', () => {
      expect(() => parseAnswer(null)).toThrow(TypeError);
    });

    test('throws on invalid type', () => {
      expect(() => parseAnswer([])).toThrow(TypeError);
      expect(() => parseAnswer(false)).toThrow(TypeError);
      expect(() => parseAnswer({})).toThrow(TypeError);
      expect(() => parseAnswer(Promise.resolve('ASDF'))).toThrow(TypeError);
      expect(() => parseAnswer(() => {})).toThrow(TypeError);
      expect(() => parseAnswer(new Error('WRONG'))).toThrow(TypeError);
    });

    test('throws on empty string', () => {
      expect(() => parseAnswer('')).toThrow(RangeError);
    });

    test('throws on whitespace', () => {
      expect(() => parseAnswer('\t\t\t\t\t')).toThrow(RangeError);
      expect(() => parseAnswer('\r\n')).toThrow(RangeError);
      expect(() => parseAnswer('     ')).toThrow(RangeError);
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

  describe('answersEqual()', () => {
    test('true on strings match (exact)', () => {
      expect(answersEqual('1234', '1234')).toBe(true);
    });

    test('true on strings match (case difference)', () => {
      expect(answersEqual('ASDF', 'AsDf')).toBe(true);
    });

    test('true on number and string match', () => {
      expect(answersEqual('1234', 1234)).toBe(true);
    });

    test('true on number and number match', () => {
      expect(answersEqual(1234, 1234)).toBe(true);
    });

    test('false on strings not match', () => {
      expect(answersEqual('asdf', '1234')).toBe(false);
    });

    test('false on number and string not match', () => {
      expect(answersEqual('1234', 4321)).toBe(false);
    });

    test('false on number and number not match', () => {
      expect(answersEqual(1234, 4321)).toBe(false);
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

  describe('getNextUnansweredPuzzle()', () => {
    test('returns first if none answered', async () => {
      const year = 1950;
      const puzzlesForYear = [
        { year, day: 1, level: 1 },
        { year, day: 2, level: 1 },
        { year, day: 3, level: 1 },
        { year, day: 4, level: 1 },
      ];
      getAllPuzzlesForYear.mockReturnValueOnce(puzzlesForYear);
      getPuzzles.mockReturnValueOnce([]);
      expect(await getNextUnansweredPuzzle(year)).toStrictEqual({ day: 1, level: 1 });
    });

    test('returns null if all answered', async () => {
      const year = 1950;
      const puzzlesForYear = [
        { year, day: 1, level: 1 },
        { year, day: 2, level: 1 },
        { year, day: 3, level: 1 },
        { year, day: 4, level: 1 },
      ];
      getAllPuzzlesForYear.mockReturnValueOnce(puzzlesForYear);
      getPuzzles.mockReturnValueOnce(puzzlesForYear.map((x) => ({ ...x, correctAnswer: '1234' })));
      expect(await getNextUnansweredPuzzle(year)).toStrictEqual(null);
    });

    test('returns next (no gaps)', async () => {
      const year = 1950;
      getAllPuzzlesForYear.mockReturnValueOnce([
        { year, day: 1, level: 1 },
        { year, day: 1, level: 2 },
        { year, day: 2, level: 1 },
        { year, day: 2, level: 2 },
        { year, day: 3, level: 1 },
        { year, day: 3, level: 2 },
        { year, day: 4, level: 1 },
        { year, day: 4, level: 2 },
        { year, day: 5, level: 1 },
        { year, day: 5, level: 2 },
      ]);
      getPuzzles.mockReturnValueOnce([
        {
          year, day: 1, level: 1, correctAnswer: 'asdf',
        },
        {
          year, day: 1, level: 2, correctAnswer: 'asdf',
        },
        {
          year, day: 2, level: 1, correctAnswer: 'asdf',
        },
        {
          year, day: 2, level: 2, correctAnswer: 'asdf',
        },
        {
          year, day: 3, level: 1, correctAnswer: 'asdf',
        },
        {
          year, day: 3, level: 2, correctAnswer: 'asdf',
        },
        {
          year, day: 4, level: 1, correctAnswer: 'asdf',
        },
      ]);
      expect(await getNextUnansweredPuzzle(year)).toStrictEqual({ day: 4, level: 2 });
    });

    test('returns next (gaps)', async () => {
      const year = 1950;
      getAllPuzzlesForYear.mockReturnValueOnce([
        { year, day: 1, level: 1 },
        { year, day: 1, level: 2 },
        { year, day: 2, level: 1 },
        { year, day: 2, level: 2 },
        { year, day: 3, level: 1 },
        { year, day: 3, level: 2 },
      ]);
      getPuzzles.mockReturnValueOnce([
        {
          year, day: 1, level: 1, correctAnswer: 'asdf',
        },
        {
          year, day: 1, level: 2, correctAnswer: 'asdf',
        },
        {
          year, day: 2, level: 1, correctAnswer: 'asdf',
        },
        {
          year, day: 2, level: 2, correctAnswer: 'asdf',
        },
        {
          year, day: 3, level: 2, correctAnswer: 'asdf',
        },
      ]);
      expect(await getNextUnansweredPuzzle(year)).toStrictEqual({ day: 3, level: 1 });
    });
  });

  describe('requiredLevelsHaveBeenSolved()', () => {
    test('returns true on level 1', async () => {
      const result = await requiredLevelsHaveBeenSolved(2022, 1, 1);
      expect(result).toBe(true);
    });

    test('returns true when required levels solved', async () => {
      const year = 2022;
      const day = 1;
      const level = 4;
      getPuzzles.mockReturnValue([
        {
          year, day, level: 1, correctAnswer: 'ASDF',
        },
        {
          year, day, level: 2, correctAnswer: 'QWER',
        },
        {
          year, day, level: 3, correctAnswer: 1234,
        },
      ]);
      const result = await requiredLevelsHaveBeenSolved(year, day, level);
      expect(result).toBe(true);
    });

    test('returns true when when re-solving already level', async () => {
      const year = 2022;
      const day = 1;
      const level = 3;
      getPuzzles.mockReturnValue([
        {
          year, day, level: 1, correctAnswer: 'ASDF',
        },
        {
          year, day, level: 2, correctAnswer: 'QWER',
        },
        {
          year, day, level: 3, correctAnswer: 1234,
        },
      ]);
      const result = await requiredLevelsHaveBeenSolved(year, day, level);
      expect(result).toBe(true);
    });

    test('returns false on none solved', async () => {
      const year = 2022;
      const day = 1;
      const level = 2;
      getPuzzles.mockReturnValue([
        {
          year, day, level: 1, correctAnswer: null,
        },
        {
          year, day, level: 2, correctAnswer: null,
        },
        {
          year, day, level: 3, correctAnswer: null,
        },
      ]);
      const result = await requiredLevelsHaveBeenSolved(year, day, level);
      expect(result).toBe(false);
    });

    test('returns false on required level not solved (consecutive)', async () => {
      const year = 2022;
      const day = 1;
      const level = 4;
      getPuzzles.mockReturnValue([
        {
          year, day, level: 1, correctAnswer: 'ASDF',
        },
        {
          year, day, level: 2, correctAnswer: 'ASDF',
        },
        {
          year, day, level: 3, correctAnswer: null,
        },
      ]);
      const result = await requiredLevelsHaveBeenSolved(year, day, level);
      expect(result).toBe(false);
    });

    test('returns false on required level not solved (non-consecutive)', async () => {
      const year = 2022;
      const day = 1;
      const level = 4;
      getPuzzles.mockReturnValue([
        {
          year, day, level: 1, correctAnswer: 'ASDF',
        },
        {
          year, day, level: 2, correctAnswer: null,
        },
        {
          year, day, level: 3, correctAnswer: null,
        },
      ]);
      const result = await requiredLevelsHaveBeenSolved(year, day, level);
      expect(result).toBe(false);
    });

    test('returns false on no data for day', async () => {
      getPuzzles.mockReturnValue([]);
      const result = await requiredLevelsHaveBeenSolved(2022, 1, 2);
      expect(result).toBe(false);
    });
  });
});
