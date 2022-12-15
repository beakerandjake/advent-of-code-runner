import { describe, jest, test } from '@jest/globals';
import { UserDataTranslationError } from '../src/errors/index.js';

// setup getConfigValue so it can be mocked.
jest.unstable_mockModule('../src/user-data/jsonFileStore.js', () => ({
  getStoreValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { translateToPuzzleFromData, translateToDataFromPuzzle, getId } = await import('../src/user-data/puzzleRepository.js');

describe('puzzleRepository', () => {
  describe('translateToPuzzleFromData()', () => {
    test('throws with null value', () => {
      expect(() => translateToPuzzleFromData(null)).toThrow(UserDataTranslationError);
    });

    test('throws with undefined value', () => {
      expect(() => translateToPuzzleFromData(undefined)).toThrow(UserDataTranslationError);
    });

    test('throws with non object', () => {
      expect(() => translateToPuzzleFromData(1234)).toThrow(UserDataTranslationError);
      expect(() => translateToPuzzleFromData(() => {})).toThrow(UserDataTranslationError);
      expect(
        () => translateToPuzzleFromData(Promise.resolve(10)),
      ).toThrow(UserDataTranslationError);
      expect(() => translateToPuzzleFromData('asdf')).toThrow(UserDataTranslationError);
    });

    test('throws missing id', () => {
      const puzzle = {
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws non string id', () => {
      const puzzle = {
        id: 20021205,
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws id contains non-numeric character', () => {
      const puzzle = {
        id: '200212z5',
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with id invalid length', () => {
      const puzzle = {
        id: '202212',
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with incorrectAnswers not array', () => {
      const puzzle = {
        id: '20221201',
        fastestExecutionTimeNs: null,
        incorrectAnswers: {},
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with fastestExecutionTime not number', () => {
      const puzzle = {
        id: '20221201',
        fastestExecutionTimeNs: 'Really Fast!',
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    });

    test('translates year, day, part from id', () => {
      const data = {
        id: '20220201',
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = {
        year: 2022,
        day: 2,
        part: 1,
      };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates id', () => {
      const data = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = { id: '20220201' };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates fastestExecutionTimeNs', () => {
      const data = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = {
        fastestExecutionTimeNs: 12345,
      };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates incorrectAnswers', () => {
      const incorrectAnswers = ['asdf', 'qwerty', 'zaps'];

      const data = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers,
        correctAnswer: null,
      };

      const expected = { incorrectAnswers };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates correctAnswer', () => {
      const data = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: 'asdf',
      };

      const expected = { correctAnswer: 'asdf' };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });
  });

  describe('translateToDataFromPuzzle()', () => {
    test('throws with null value', () => {
      expect(() => translateToDataFromPuzzle(null)).toThrow(UserDataTranslationError);
    });

    test('throws with undefined value', () => {
      expect(() => translateToDataFromPuzzle(undefined)).toThrow(UserDataTranslationError);
    });

    test('throws with non object', () => {
      expect(() => translateToDataFromPuzzle(1234)).toThrow(UserDataTranslationError);
      expect(() => translateToDataFromPuzzle(() => {})).toThrow(UserDataTranslationError);
      expect(
        () => translateToDataFromPuzzle(Promise.resolve(10)),
      ).toThrow(UserDataTranslationError);
      expect(() => translateToDataFromPuzzle('asdf')).toThrow(UserDataTranslationError);
    });

    test('throws missing id', () => {
      const puzzle = {
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws non string id', () => {
      const puzzle = {
        id: 20021205,
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws id contains non-numeric character', () => {
      const puzzle = {
        id: 'J0021225',
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with id invalid length', () => {
      const puzzle = {
        id: '202212',
        fastestExecutionTimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with incorrectAnswers not array', () => {
      const puzzle = {
        id: '20221201',
        fastestExecutionTimeNs: null,
        incorrectAnswers: {},
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('throws with fastestExecutionTime not number', () => {
      const puzzle = {
        id: '20221201',
        fastestExecutionTimeNs: 'Really Fast!',
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        part: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
    });

    test('strips properties (year, day, part)', () => {
      const data = {
        id: '20220201',
        fastestExecutionTimeNs: 2343455,
        incorrectAnswers: ['wrong', 'answers', 'only'],
        correctAnswer: 'asdf',
        year: 2022,
        day: 20,
        part: 1,
      };

      const translated = translateToDataFromPuzzle(data);

      expect(translated).not.toHaveProperty('year');
      expect(translated).not.toHaveProperty('day');
      expect(translated).not.toHaveProperty('part');
    });

    test('translates id', () => {
      const puzzle = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: ['asdf'],
        correctAnswer: 'qwer',
      };

      const expected = { id: '20220201' };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });

    test('translates fastestExecutionTimeNs', () => {
      const puzzle = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: ['asdf'],
        correctAnswer: 'qwer',
      };

      const expected = { fastestExecutionTimeNs: 12345 };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });

    test('translates incorrectAnswers', () => {
      const incorrectAnswers = ['asdf', 'qwerty', 'zaps'];

      const puzzle = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers,
        correctAnswer: 'qwer',
      };

      const expected = { incorrectAnswers };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });

    test('translates correctAnswer', () => {
      const correctAnswer = '1234';

      const puzzle = {
        id: '20220201',
        fastestExecutionTimeNs: 12345,
        incorrectAnswers: ['asdf'],
        correctAnswer,
      };

      const expected = { correctAnswer };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });
  });

  describe('getId()', () => {
    test('day is padded', () => {
      const id = getId(2022, 1, 2);
      expect(id.substring(4, 6)).toEqual('01');
    });

    test('part is padded', () => {
      const id = getId(2022, 1, 2);
      expect(id.substring(6)).toEqual('02');
    });

    test('year in correct position', () => {
      const id = getId(2022, 1, 2);
      expect(id.substring(0, 4)).toEqual('2022');
    });

    test('day in correct position', () => {
      const id = getId(2022, 12, 2);
      expect(id.substring(4, 6)).toEqual('12');
    });

    test('part in correct position', () => {
      const id = getId(2022, 5, 1);
      expect(id.substring(6)).toEqual('01');
    });

    test('throws when year is null', () => {
      expect(() => getId(null, 1, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when year length < 4', () => {
      expect(() => getId(222, 1, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when year length > 4', () => {
      expect(() => getId(50000, 1, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when year is negative', () => {
      expect(() => getId(-2022, 1, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when year is non-numeric', () => {
      expect(() => getId('202R', 1, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when day is null', () => {
      expect(() => getId(2022, null, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when day is negative', () => {
      expect(() => getId(2022, -2, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when day length > 2', () => {
      expect(() => getId(2022, 100, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when day is non-numeric', () => {
      expect(() => getId(2022, 'Y', 2)).toThrow(UserDataTranslationError);
    });

    test('throws when part is null', () => {
      expect(() => getId(2022, null, 2)).toThrow(UserDataTranslationError);
    });

    test('throws when part length > 2', () => {
      expect(() => getId(2022, 1, 111)).toThrow(UserDataTranslationError);
    });

    test('throws when part is negative', () => {
      expect(() => getId(2022, 2, -2)).toThrow(UserDataTranslationError);
    });

    test('throws when part is non-numeric', () => {
      expect(() => getId(2022, 1, 'H')).toThrow(UserDataTranslationError);
    });


  });
});
