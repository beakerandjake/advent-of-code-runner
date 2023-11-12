module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.test.js'], // Or *.test.js
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
    'import/no-unresolved': [
      2,
      // ignore false positive when importing v11.1.0
      { ignore: ['fs-extra/esm'] },
    ],
    'no-plusplus':'off',
    'no-unused-vars': ['error', { "argsIgnorePattern": "^_" } ]
  },
};
