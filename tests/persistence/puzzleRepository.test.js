import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();

jest.unstable_mockModule('../../src/persistence/userDataFile.js', () => ({
  getValue: jest.fn(),
  setValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getValue, setValue } = await import(
  '../../src/persistence/userDataFile.js'
);
const {
  translateToPuzzleFromData,
  translateToDataFromPuzzle,
  getId,
  findPuzzle,
  getPuzzles,
  getPuzzlesForYear,
  setPuzzles,
  addOrEditPuzzle,
  createPuzzle,
} = await import('../../src/persistence/puzzleRepository.js');

describe('puzzleRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('translateToPuzzleFromData()', () => {
    test('throws with null value', () => {
      expect(() => translateToPuzzleFromData(null)).toThrow(TypeError);
    });

    test('throws with undefined value', () => {
      expect(() => translateToPuzzleFromData(undefined)).toThrow(TypeError);
    });

    test('throws with non object', () => {
      expect(() => translateToPuzzleFromData(1234)).toThrow(TypeError);
      expect(() => translateToPuzzleFromData(() => {})).toThrow(TypeError);
      expect(() => translateToPuzzleFromData(Promise.resolve(10))).toThrow(
        TypeError
      );
      expect(() => translateToPuzzleFromData('asdf')).toThrow(TypeError);
    });

    test('throws missing id', () => {
      const puzzle = {
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('throws non string id', () => {
      const puzzle = {
        id: 20021205,
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('throws id contains non-numeric character', () => {
      const puzzle = {
        id: '200212z5',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('throws with id invalid length', () => {
      const puzzle = {
        id: '202212',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('throws with incorrectAnswers not array', () => {
      const puzzle = {
        id: '20221201',
        fastestRuntimeNs: null,
        incorrectAnswers: {},
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('throws with fastestRuntimeNs not number', () => {
      const puzzle = {
        id: '20221201',
        fastestRuntimeNs: 'Really Fast!',
        incorrectAnswers: [],
        correctAnswer: null,
      };
      expect(() => translateToPuzzleFromData(puzzle)).toThrow(TypeError);
    });

    test('translates year, day, level from id', () => {
      const data = {
        id: '20220201',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = {
        year: 2022,
        day: 2,
        level: 1,
      };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates id', () => {
      const data = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = { id: '20220201' };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates fastestRuntimeNs', () => {
      const data = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: null,
      };

      const expected = {
        fastestRuntimeNs: 12345,
      };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates incorrectAnswers', () => {
      const incorrectAnswers = ['asdf', 'qwerty', 'zaps'];

      const data = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers,
        correctAnswer: null,
      };

      const expected = { incorrectAnswers };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });

    test('translates correctAnswer', () => {
      const data = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers: [],
        correctAnswer: 'asdf',
      };

      const expected = { correctAnswer: 'asdf' };

      expect(translateToPuzzleFromData(data)).toMatchObject(expected);
    });
  });

  describe('translateToDataFromPuzzle()', () => {
    test('throws with null value', () => {
      expect(() => translateToDataFromPuzzle(null)).toThrow(TypeError);
    });

    test('throws with undefined value', () => {
      expect(() => translateToDataFromPuzzle(undefined)).toThrow(TypeError);
    });

    test('throws with non object', () => {
      expect(() => translateToDataFromPuzzle(1234)).toThrow(TypeError);
      expect(() => translateToDataFromPuzzle(() => {})).toThrow(TypeError);
      expect(() => translateToDataFromPuzzle(Promise.resolve(10))).toThrow(
        TypeError
      );
      expect(() => translateToDataFromPuzzle('asdf')).toThrow(TypeError);
    });

    test('throws missing id', () => {
      const puzzle = {
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('throws non string id', () => {
      const puzzle = {
        id: 20021205,
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('throws id contains non-numeric character', () => {
      const puzzle = {
        id: 'J0021225',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('throws with id invalid length', () => {
      const puzzle = {
        id: '202212',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('throws with incorrectAnswers not array', () => {
      const puzzle = {
        id: '20221201',
        fastestRuntimeNs: null,
        incorrectAnswers: {},
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('throws with fastestRuntimeNs not number', () => {
      const puzzle = {
        id: '20221201',
        fastestRuntimeNs: 'Really Fast!',
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 20,
        level: 1,
      };
      expect(() => translateToDataFromPuzzle(puzzle)).toThrow(TypeError);
    });

    test('strips properties (year, day, level)', () => {
      const data = {
        id: '20220201',
        fastestRuntimeNs: 2343455,
        incorrectAnswers: ['wrong', 'answers', 'only'],
        correctAnswer: 'asdf',
        year: 2022,
        day: 20,
        level: 1,
      };

      const translated = translateToDataFromPuzzle(data);

      expect(translated).not.toHaveProperty('year');
      expect(translated).not.toHaveProperty('day');
      expect(translated).not.toHaveProperty('level');
    });

    test('translates id', () => {
      const puzzle = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers: ['asdf'],
        correctAnswer: 'qwer',
      };

      const expected = { id: '20220201' };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });

    test('translates fastestRuntimeNs', () => {
      const puzzle = {
        id: '20220201',
        fastestRuntimeNs: 12345,
        incorrectAnswers: ['asdf'],
        correctAnswer: 'qwer',
      };

      const expected = { fastestRuntimeNs: 12345 };

      expect(translateToDataFromPuzzle(puzzle)).toMatchObject(expected);
    });

    test('translates incorrectAnswers', () => {
      const incorrectAnswers = ['asdf', 'qwerty', 'zaps'];

      const puzzle = {
        id: '20220201',
        fastestRuntimeNs: 12345,
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
        fastestRuntimeNs: 12345,
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

    test('level is padded', () => {
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

    test('level in correct position', () => {
      const id = getId(2022, 5, 1);
      expect(id.substring(6)).toEqual('01');
    });

    test('throws when year is null', () => {
      expect(() => getId(null, 1, 2)).toThrow(TypeError);
    });

    test('throws when year length < 4', () => {
      expect(() => getId(222, 1, 2)).toThrow(TypeError);
    });

    test('throws when year length > 4', () => {
      expect(() => getId(50000, 1, 2)).toThrow(TypeError);
    });

    test('throws when year is non-numeric', () => {
      expect(() => getId('202R', 1, 2)).toThrow(TypeError);
    });

    test('throws when day is null', () => {
      expect(() => getId(2022, null, 2)).toThrow(TypeError);
    });

    test('throws when day is negative', () => {
      expect(() => getId(2022, -2, 2)).toThrow(TypeError);
    });

    test('throws when day length > 2', () => {
      expect(() => getId(2022, 100, 2)).toThrow(TypeError);
    });

    test('throws when day is non-numeric', () => {
      expect(() => getId(2022, 'Y', 2)).toThrow(TypeError);
    });

    test('throws when level is null', () => {
      expect(() => getId(2022, null, 2)).toThrow(TypeError);
    });

    test('throws when level length > 2', () => {
      expect(() => getId(2022, 1, 111)).toThrow(TypeError);
    });

    test('throws when level is negative', () => {
      expect(() => getId(2022, 2, -2)).toThrow(TypeError);
    });

    test('throws when level is non-numeric', () => {
      expect(() => getId(2022, 1, 'H')).toThrow(TypeError);
    });
  });

  describe('findPuzzle()', () => {
    test('returns puzzle when exists', async () => {
      const matchingPuzzleId = '20221201';

      getValue.mockReturnValueOnce([
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
        },
        {
          id: matchingPuzzleId,
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        },
      ]);

      const expected = {
        id: matchingPuzzleId,
        correctAnswer: null,
        fastestRuntimeNs: null,
        incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        year: 2022,
        day: 12,
        level: 1,
      };

      expect(await findPuzzle(2022, 12, 1)).toEqual(expected);
    });

    test('returns null when puzzle does not exist', async () => {
      getValue.mockReturnValueOnce([
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        },
      ]);

      expect(await findPuzzle(1996, 4, 1)).toBeNull();
    });

    test('returns null on empty array', async () => {
      getValue.mockReturnValueOnce([]);
      expect(await findPuzzle(2022, 1, 1)).toBeNull();
    });
  });

  describe('getPuzzles()', () => {
    test('returns expected values', async () => {
      getValue.mockReturnValueOnce([
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        },
      ]);

      const expected = [
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
          year: 2022,
          day: 12,
          level: 2,
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
          year: 2022,
          day: 12,
          level: 1,
        },
      ];

      expect(await getPuzzles()).toStrictEqual(expected);
    });

    test('returns empty array as default', async () => {
      getValue.mockReturnValueOnce([]);
      expect(await getPuzzles()).toEqual([]);
    });
  });

  describe('getPuzzlesForYear()', () => {
    const mockGetPuzzles = (puzzles) => {
      getValue.mockImplementation(async (key) => {
        if (key === 'puzzles') {
          return puzzles;
        }
        throw Error('unexpected getValue call in test');
      });
    };

    test('returns empty array if no stored data', async () => {
      mockGetPuzzles([]);
      const result = await getPuzzlesForYear(2022);
      expect(result).toEqual([]);
    });

    test('returns empty array if no puzzles for year', async () => {
      mockGetPuzzles([
        { id: '20200101' },
        { id: '20210101' },
        { id: '20230101' },
      ]);
      const result = await getPuzzlesForYear(2022);
      expect(result).toEqual([]);
    });

    test('returns all puzzles for year', async () => {
      const year = 2022;
      const expected = [
        { id: `${year}0101` },
        { id: `${year}0102` },
        { id: `${year}0201` },
      ];
      mockGetPuzzles([
        ...expected,
        { id: `${year - 2}0101` },
        { id: `${year - 1}0101` },
        { id: `${year + 1}0101` },
      ]);
      const result = await getPuzzlesForYear(year);
      result.forEach((x) => expect(x.year).toBe(year));
    });
  });

  describe('setPuzzles()', () => {
    test('maps values before setting', async () => {
      const input = [
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
          year: 2022,
          day: 12,
          level: 2,
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
          year: 2022,
          day: 12,
          level: 1,
        },
      ];

      const expected = [
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        },
      ];

      await setPuzzles(input);

      // get the value of the puzzle array that was pass to the store by set puzzles
      const valuePassedToStore = setValue.mock.lastCall[1];

      expect(valuePassedToStore).toStrictEqual(expected);
    });

    test('handles empty array', async () => {
      await setPuzzles([]);

      // get the value of the puzzle array that was pass to the store by set puzzles
      const valuePassedToStore = setValue.mock.lastCall[1];

      expect(valuePassedToStore).toStrictEqual([]);
    });
  });

  describe('addOrEditPuzzle()', () => {
    test.each([null, undefined])(
      'throws if puzzle is: "%s"',
      async (puzzle) => {
        await expect(async () => addOrEditPuzzle(puzzle)).rejects.toThrow(
          'null puzzle'
        );
      }
    );

    test("adds puzzle doesn't exist", async () => {
      const doesNotExist = {
        id: '20221301',
        correctAnswer: null,
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        year: 2022,
        day: 13,
        level: 1,
      };

      const orig = [
        {
          id: '20221202',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: 1234653,
          incorrectAnswers: ['WRONG', 'WRONG AGAIN!'],
        },
        {
          id: '20221201',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: ['NOPE', 'NOPE AGAIN!'],
        },
      ];

      getValue.mockReturnValueOnce(orig);

      await addOrEditPuzzle(doesNotExist);

      const expected = [
        ...orig,
        {
          id: doesNotExist.id,
          correctAnswer: doesNotExist.correctAnswer,
          fastestRuntimeNs: doesNotExist.fastestRuntimeNs,
          incorrectAnswers: doesNotExist.incorrectAnswers,
        },
      ];

      expect(setValue.mock.lastCall[1]).toStrictEqual(expected);
    });

    test('edits correct answer', async () => {
      const newAnswer = 'NEW ANSWER!';

      getValue.mockReturnValueOnce([
        { id: '20221202' },
        { id: '20221201' },
        { id: '20221301', correctAnswer: 'OLD ANSWER' },
      ]);

      await addOrEditPuzzle({
        id: '20221301',
        correctAnswer: newAnswer,
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        year: 2022,
        day: 13,
        level: 1,
      });

      expect(setValue.mock.lastCall[1]).toStrictEqual([
        { id: '20221202' },
        { id: '20221201' },
        {
          id: '20221301',
          correctAnswer: newAnswer,
          fastestRuntimeNs: null,
          incorrectAnswers: [],
        },
      ]);
    });

    test('edits correct fastestRuntimeNs', async () => {
      const newValue = 4567;

      getValue.mockReturnValueOnce([
        { id: '20221202' },
        { id: '20221201' },
        { id: '20221301', fastestRuntimeNs: 1234 },
      ]);

      await addOrEditPuzzle({
        id: '20221301',
        correctAnswer: 'ASDF',
        fastestRuntimeNs: newValue,
        incorrectAnswers: [],
        year: 2022,
        day: 13,
        level: 1,
      });

      expect(setValue.mock.lastCall[1]).toStrictEqual([
        { id: '20221202' },
        { id: '20221201' },
        {
          id: '20221301',
          correctAnswer: 'ASDF',
          fastestRuntimeNs: newValue,
          incorrectAnswers: [],
        },
      ]);
    });

    test('edits incorrectAnswers', async () => {
      const newValue = ['ASDF', 'QWERTY'];

      getValue.mockReturnValueOnce([
        { id: '20221202' },
        { id: '20221201' },
        { id: '20221301', incorrectAnswers: ['ASDF'] },
      ]);

      await addOrEditPuzzle({
        id: '20221301',
        correctAnswer: null,
        fastestRuntimeNs: null,
        incorrectAnswers: newValue,
        year: 2022,
        day: 13,
        level: 1,
      });

      expect(setValue.mock.lastCall[1]).toStrictEqual([
        { id: '20221202' },
        { id: '20221201' },
        {
          id: '20221301',
          correctAnswer: null,
          fastestRuntimeNs: null,
          incorrectAnswers: newValue,
        },
      ]);
    });
  });

  describe('createPuzzle()', () => {
    test('returns expected object', () => {
      const expected = {
        id: '20220101',
        fastestRuntimeNs: null,
        incorrectAnswers: [],
        correctAnswer: null,
        year: 2022,
        day: 1,
        level: 1,
      };

      expect(
        createPuzzle(expected.year, expected.day, expected.level)
      ).toStrictEqual(expected);
    });
  });
});
