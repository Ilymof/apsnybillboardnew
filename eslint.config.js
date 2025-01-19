const globals = require('globals')
const pluginJs = require('@eslint/js')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
   {
      files: ['**/*.js'],
      languageOptions: {
         sourceType: 'commonjs',
         globals: {
            ...globals.node,
         },
      },
      rules: {
         'semi': ['error', 'never'], // Убираем точки с запятой
         'quotes': ['error', 'single'],
         'indent': ['error', 3, { 'SwitchCase': 1 }],
         'eqeqeq': 'error',
         'curly': 'error',
      },
   },
   pluginJs.configs.recommended,
]
