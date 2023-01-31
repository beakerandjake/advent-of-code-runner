export const uncoveredFunction = async ({ year }) => {
  if (year === 2022) {
    throw new Error('WOOF');
  }

  if (year == null) {
    throw new Error('NULL');
  }

  const z = year * 2;
  const q = z / 2;
  const p = year * q;
  console.log('p', p);
};
