module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true, // Ajouté pour public/script.js
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
  ],
};
