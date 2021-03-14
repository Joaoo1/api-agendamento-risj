module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    camelcase: 'off',
  },
};
