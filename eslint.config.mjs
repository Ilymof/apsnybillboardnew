import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
   {
      files: ['**/*.js'],
      languageOptions: {
         sourceType: 'commonjs',
         globals: { ...globals.browser, __dirname: 'readonly' }
      }
   },
   pluginJs.configs.recommended,
   {
      rules: {
         'indent': ['error', 3],
         'semi': ['error', 'never'],
         'no-mixed-spaces-and-tabs': 'error',
         'quotes': ['error', 'single'],
         'comma-dangle': ['error', 'never']
      }
   }
]
