// import {
//   describe, jest, test, beforeEach,
// } from '@jest/globals';
// import { mockLogger } from '../mocks.js';

// // setup mocks
// mockLogger();
// jest.unstable_mockModule('ora', () => ({
//   default: () => ({
//     start: () => ({
//       test: () => {},
//       stopAndPersist: () => {},
//       fail: () => {},
//     }),
//   }),
// }));
// jest.unstable_mockModule('../../src/actions/initializeQuestions.js', () => ({
//   initializeQuestions: [],
//   confirmOverwriteCwdQuestion: {},
// }));
// jest.unstable_mockModule('src/initialize/index.js', () => ({
//   cwdIsEmpty: jest.fn(),
//   createFiles: jest.fn(),
//   installPackages: jest.fn(),
// }));
// jest.unstable_mockModule('src/actions/interactive.js', () => ({
//   confirmWithUser: jest.fn(),
//   getAnswersFromUser: jest.fn(),
// }));
// jest.unstable_mockModule('src/festive.js', () => ({
//   festiveStyle: jest.fn(),
//   festiveEmoji: jest.fn(),
// }));

// const { createFiles, cwdIsEmpty, installPackages } = await import('../../src/initialize/index.js');
// const { confirmWithUser, getAnswersFromUser } = await import('../../src/actions/interactive.js');
// const { initialize } = await import('../../src/actions/initialize.js');

// beforeEach(() => {
//   jest.resetAllMocks();
// });

// describe('actions', () => {
//   describe('initialize()', () => {
//     test('asks user to confirm if cwd is not empty', async () => {
//       cwdIsEmpty.mockResolvedValue(false);
//       confirmWithUser.mockResolvedValue(false);
//       await initialize();
//       expect(confirmWithUser).toHaveBeenCalled();
//     });

//     test('does not ask user to confirm if cwd is empty', async () => {
//       cwdIsEmpty.mockResolvedValue(true);
//       await initialize();
//       expect(confirmWithUser).not.toHaveBeenCalled();
//     });

//     test('does not continue if user does not confirm.', async () => {
//       cwdIsEmpty.mockResolvedValue(false);
//       confirmWithUser.mockResolvedValue(false);
//       await initialize();
//       expect(getAnswersFromUser).not.toHaveBeenCalled();
//       expect(createFiles).not.toHaveBeenCalled();
//       expect(installPackages).not.toHaveBeenCalled();
//     });

//     test('asks questions', async () => {
//       cwdIsEmpty.mockResolvedValue(false);
//       confirmWithUser.mockResolvedValue(true);
//       await initialize();
//       expect(getAnswersFromUser).toHaveBeenCalled();
//     });

//     test('calls create files', async () => {
//       cwdIsEmpty.mockResolvedValue(true);
//       await initialize();
//       expect(createFiles).toHaveBeenCalled();
//     });

//     test('does not install packages if create files fails', async () => {
//       cwdIsEmpty.mockResolvedValue(true);
//       createFiles.mockRejectedValue(new Error());
//       await expect(async () => initialize()).rejects.toThrow();
//       expect(createFiles).toHaveBeenCalled();
//       expect(installPackages).not.toHaveBeenCalled();
//     });

//     test('installs packages', async () => {
//       cwdIsEmpty.mockResolvedValue(true);
//       await initialize();
//       expect(createFiles).toHaveBeenCalled();
//     });
//   });
// });


test.todo('todo');