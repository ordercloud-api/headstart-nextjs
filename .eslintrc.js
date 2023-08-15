module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  root: true,
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended', 'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // rules here override any rules defined by plugins in the "extends" array
    // those rules are generally considered best practices so consider carefully and
    // discuss with (and record) why a certain rule has been disabled or altered
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src'],
      },
    },
  },
}
