/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const rules = {
  'header/header': [2, 'copyright.txt'],
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/no-extraneous-dependencies': [0],
  'react/jsx-filename-extension': [1, { extensions: ['.js', '.tsx'] }],
  'react/forbid-prop-types': [0],
  'import/prefer-default-export': [0],
  camelcase: [0],
  'linebreak-style': [0],
  'default-param-last': [0],
  'react/no-unstable-nested-components': [0],
  'react/jsx-no-useless-fragment': [0],
  'react/function-component-definition': [1, {
    namedComponents: 'arrow-function',
    unnamedComponents: 'arrow-function',
  }],
};

module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['airbnb'],
  env: {
    browser: true,
  },
  plugins: ['header'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules,
  overrides: [{
    // for files matching this pattern
    files: ['*.{ts,tsx}'],
    // following config will override "normal" config
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
    },
    extends: ['airbnb', 'airbnb-typescript'],
    rules,
  }],
};
