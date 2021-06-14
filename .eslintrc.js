module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/standard',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: 'babel-eslint',
  },
  rules: {
    'indent': [
      'error',
      2,
    ],
    'arrow-parens': 'off',
    'quote-props': [
      'error',
      'consistent-as-needed',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-alert': 'off',
    'no-params-reassign': 'off',
    // Пробел между именем функции и открывающимися скобками
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'object-curly-spacing': [
      'error',
      'always',
      { objectsInObjects: false },
    ],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignores: ['pre', 'textarea'],
    }],
    'vue/html-closing-bracket-newline': [
      'error', { multiline: 'never' },
    ],
    'generator-star-spacing': ['error', {
      before: true,
      after: false,
    }],
  },
};
