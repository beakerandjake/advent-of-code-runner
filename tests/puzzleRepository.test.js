import { describe, jest, test } from '@jest/globals';
import { UserDataTranslationError } from '../src/errors/index.js';

// setup getConfigValue so it can be mocked.
jest.unstable_mockModule('../src/user-data/jsonFileStore.js', () => ({
  getStoreValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { translateToPuzzleFromData, translateToDataFromPuzzle } = await import('../src/user-data/puzzleRepository.js');

describe('puzzleRepository', () => {
  beforeEach(() => jest.resetAllMocks());
  describe('translateToPuzzleFromData()', () => {
    // test('throws with null value', () => {
    //   expect(() => translateToPuzzleFromData(null)).toThrow(UserDataTranslationError);
    // });

    // test('throws with undefined value', () => {
    //   expect(() => translateToPuzzleFromData(undefined)).toThrow(UserDataTranslationError);
    // });

    // test('throws with non object', () => {
    //   expect(() => translateToPuzzleFromData(1234)).toThrow(UserDataTranslationError);
    //   expect(() => translateToPuzzleFromData(() => {})).toThrow(UserDataTranslationError);
    //   expect(
    //     () => translateToPuzzleFromData(Promise.resolve(10)),
    //   ).toThrow(UserDataTranslationError);
    //   expect(() => translateToPuzzleFromData('asdf')).toThrow(UserDataTranslationError);
    // });

    // test('throws missing id', () => {
    //   const puzzle = {
    //     fastestExecutionTimeNs: null,
    //     incorrectAnswers: [],
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    // test('throws non string id', () => {
    //   const puzzle = {
    //     id: 20021205,
    //     fastestExecutionTimeNs: null,
    //     incorrectAnswers: [],
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    // test('throws id contains non-numeric character', () => {
    //   const puzzle = {
    //     id: '200212z5',
    //     fastestExecutionTimeNs: null,
    //     incorrectAnswers: [],
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    // test('throws with id invalid length', () => {
    //   const puzzle = {
    //     id: '202212',
    //     fastestExecutionTimeNs: null,
    //     incorrectAnswers: [],
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    // test('throws with incorrectAnswers not array', () => {
    //   const puzzle = {
    //     id: '20221201',
    //     fastestExecutionTimeNs: null,
    //     incorrectAnswers: {},
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    // test('throws with fastestExecutionTime not number', () => {
    //   const puzzle = {
    //     id: '20221201',
    //     fastestExecutionTimeNs: 'Really Fast!',
    //     incorrectAnswers: [],
    //     correctAnswer: null,
    //   };
    //   expect(() => translateToPuzzleFromData(puzzle)).toThrow(UserDataTranslationError);
    // });

    test('correctly translates year, day, part from id', () => {
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

    test('correctly translates fastestExecutionTimeNs', () => {
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
  });

  // describe('translateToDataFromPuzzle()', () => {
  //   test('throws with null value', () => {
  //     expect(() => translateToDataFromPuzzle(null)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws with undefined value', () => {
  //     expect(() => translateToDataFromPuzzle(undefined)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws with non object', () => {
  //     expect(() => translateToDataFromPuzzle(1234)).toThrow(UserDataTranslationError);
  //     expect(() => translateToDataFromPuzzle(() => {})).toThrow(UserDataTranslationError);
  //     expect(
  //       () => translateToDataFromPuzzle(Promise.resolve(10)),
  //     ).toThrow(UserDataTranslationError);
  //     expect(() => translateToDataFromPuzzle('asdf')).toThrow(UserDataTranslationError);
  //   });

  //   test('throws missing id', () => {
  //     const puzzle = {
  //       fastestExecutionTimeNs: null,
  //       incorrectAnswers: [],
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws non string id', () => {
  //     const puzzle = {
  //       id: 20021205,
  //       fastestExecutionTimeNs: null,
  //       incorrectAnswers: [],
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws id contains non-numeric character', () => {
  //     const puzzle = {
  //       id: 'J0021225',
  //       fastestExecutionTimeNs: null,
  //       incorrectAnswers: [],
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws with id invalid length', () => {
  //     const puzzle = {
  //       id: '202212',
  //       fastestExecutionTimeNs: null,
  //       incorrectAnswers: [],
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws with incorrectAnswers not array', () => {
  //     const puzzle = {
  //       id: '20221201',
  //       fastestExecutionTimeNs: null,
  //       incorrectAnswers: {},
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('throws with fastestExecutionTime not number', () => {
  //     const puzzle = {
  //       id: '20221201',
  //       fastestExecutionTimeNs: 'Really Fast!',
  //       incorrectAnswers: [],
  //       correctAnswer: null,
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };
  //     expect(() => translateToDataFromPuzzle(puzzle)).toThrow(UserDataTranslationError);
  //   });

  //   test('translates to expected', () => {
  //     const data = {
  //       id: '20220201',
  //       fastestExecutionTimeNs: 2343455,
  //       incorrectAnswers: ['wrong', 'answers', 'only'],
  //       correctAnswer: 'asdf',
  //       year: 2022,
  //       day: 20,
  //       part: 1,
  //     };

  //     const expected = {
  //       id: '20220201',
  //       fastestExecutionTimeNs: 2343455,
  //       incorrectAnswers: ['wrong', 'answers', 'only'],
  //       correctAnswer: 'asdf',
  //     };

  //     expect(translateToDataFromPuzzle(data)).toMatchObject(expected);
  //   });
  // });
});
