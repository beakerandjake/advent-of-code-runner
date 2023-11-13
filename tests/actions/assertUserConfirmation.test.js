import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
jest.unstable_mockModule('@inquirer/prompts', () => ({
  confirm: jest.fn(),
}));

// import after setting up mocks
const { confirm } = await import('@inquirer/prompts');
const { assertUserConfirmation } = await import(
  '../../src/actions/assertUserConfirmation.js'
);

describe('assertUserConfirmation()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    null,
    undefined,
    {},
    { confirmQuestion: null },
    { confirmQuestion: {} },
    { confirmQuestion: { message: '' } },
    { confirmQuestion: { message: null } },
  ])('throws if arg is %s', async (args) => {
    await expect(async () => assertUserConfirmation(args)).rejects.toThrow();
  });

  test('invokes confirm only once', async () => {
    await assertUserConfirmation({ confirmQuestion: { message: 'hi' } });
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  test('passes args to confirm', async () => {
    const input = { confirmQuestion: { message: 'hi' } };
    await assertUserConfirmation(input);
    expect(confirm).toBeCalledWith(input.confirmQuestion);
  });

  test('returns true if confirm returns true', async () => {
    confirm.mockResolvedValue(true);
    const input = { confirmQuestion: { message: 'hi' } };
    const result = await assertUserConfirmation(input);
    expect(result).toBe(true);
  });

  test('returns false if confirm returns false', async () => {
    confirm.mockResolvedValue(false);
    const input = { confirmQuestion: { message: 'hi' } };
    const result = await assertUserConfirmation(input);
    expect(result).toBe(false);
  });
});
