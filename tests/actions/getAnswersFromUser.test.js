import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
jest.unstable_mockModule('@inquirer/prompts', () => ({
  confirm: jest.fn(),
  select: jest.fn(),
  password: jest.fn(),
}));

// import after setting up mocks
const { confirm, select, password } = await import('@inquirer/prompts');
const { getAnswersFromUser } = await import('../../src/actions/getAnswersFromUser.js');

describe('getAnswersFromUser()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined, {}, { questions: null }])(
    'throws if args is %s',
    async (question) => {
      await expect(async () => getAnswersFromUser(question)).rejects.toThrow();
    }
  );

  test('returns answer for each question', async () => {
    const input = {
      questions: {
        one: { type: 'confirm', message: 'hi' },
        two: { type: 'select', message: 'hi' },
        three: { type: 'password', message: 'hi' },
        four: { type: 'confirm', message: 'hi' },
        five: { type: 'select', message: 'hi' },
        six: { type: 'password', message: 'hi' },
      },
    };
    const answers = await getAnswersFromUser(input);
    expect(Object.keys(answers)).toEqual(Object.keys(input.questions));
  });

  test('handles confirm questions', async () => {
    const input = {
      questions: {
        one: { type: 'confirm', message: 'hi' },
        two: { type: 'select', message: 'hi' },
        three: { type: 'password', message: 'hi' },
      },
    };
    const expected = 'ANSWER';
    confirm.mockResolvedValue(expected);
    const answers = await getAnswersFromUser(input);
    expect(answers.one).toBe(expected);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  test('handles select questions', async () => {
    const input = {
      questions: {
        one: { type: 'confirm', message: 'hi' },
        two: { type: 'select', message: 'hi' },
        three: { type: 'password', message: 'hi' },
      },
    };
    const expected = 'ANSWER';
    select.mockResolvedValue(expected);
    const answers = await getAnswersFromUser(input);
    expect(answers.two).toBe(expected);
    expect(select).toHaveBeenCalledTimes(1);
  });

  test('handles password questions', async () => {
    const input = {
      questions: {
        one: { type: 'confirm', message: 'hi' },
        two: { type: 'select', message: 'hi' },
        three: { type: 'password', message: 'hi' },
      },
    };
    const expected = 'ANSWER';
    password.mockResolvedValue(expected);
    const answers = await getAnswersFromUser(input);
    expect(answers.three).toBe(expected);
    expect(password).toHaveBeenCalledTimes(1);
  });

  test('throws on unknown question type', async () => {
    const input = {
      questions: {
        one: { type: 'NOT FOUND', message: 'hi' },
      },
    };

    await expect(async () => getAnswersFromUser(input)).rejects.toThrow();
  });
});
