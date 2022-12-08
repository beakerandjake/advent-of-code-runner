import { yearIsValid, dayIsValid, partIsValid } from '../src/validatePuzzle';

const commonFailCases = [
  null,
  undefined,
  '',
  Infinity,
  'Cats!',
  true,
  [],
  0,
  -100,
  Promise.resolve(1),
  new Error(),
  () => 1,
  1.205,
  '3',
];

test.each(commonFailCases)('yearIsValid - false on: %p', (value) => {
  expect(yearIsValid(value)).toBe(false);
});

test('yearIsValid - false on before start year', () => {
  expect(yearIsValid(2003)).toBe(false);
});

test.todo('yearIsValid - RangeError on end year before start year');
test.todo('yearIsValid - false in future');
test.todo('yearIsValid - false in this year not december');
test.todo('yearIsValid - true between min year and last year');
test.todo('yearIsValid - true in this year and its december');

test.each(commonFailCases)('dayIsValid - false on: %p', (value) => {
  expect(dayIsValid(value)).toBe(false);
});

test.todo('dayIsValid - false on above max day');
test.todo('dayIsValid - false on below min day');
test.todo('dayIsValid - true when between min and max');

test.each(commonFailCases)('partIsValid - false on: %p', (value) => {
  expect(partIsValid(value)).toBe(false);
});

test.todo('partIsValid - false when below min part');
test.todo('partIsValid - false when above max part');
