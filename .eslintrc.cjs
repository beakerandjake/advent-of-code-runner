module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      files: ['**/*.test.js'], // Or *.test.js
      rules: {
        'no-console': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'max-classes-per-file': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
};
