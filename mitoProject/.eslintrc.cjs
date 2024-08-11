module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'standard',
    'standard-with-typescript',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/display-name': ['off'],
    'consistent-return': ['off'],
    'no-underscore-dangle': ['off'],
    'max-nested-callbacks': ['warn', 3],
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'no-multi-spaces': 'error',
    'no-labels': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }]
  }
}
