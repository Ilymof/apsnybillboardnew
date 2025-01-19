const globals = require('globals');
const pluginJs = require('@eslint/js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
   {
      files: ['**/*.js'],
      languageOptions: {
         sourceType: 'commonjs', // Используем CommonJS
         globals: {
            ...globals.node, // Глобальные переменные для Node.js
         },
      },
      rules: {
         'semi': ['error', 'always'], // Точки с запятой обязательны
         'quotes': ['error', 'single'], // Одинарные кавычки
         'indent': ['error', 3, { 'SwitchCase': 1 }],
         'eqeqeq': 'error', // Строгое равенство
         'curly': 'error', // Всегда использовать {} для блоков
      },
   },
   pluginJs.configs.recommended, // Рекомендуемые правила ESLint
];
