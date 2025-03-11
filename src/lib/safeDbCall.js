const errorHandler = require('../lib/errorHandler')

/**
 * Оборачивает вызов функции для безопасного выполнения с обработкой ошибок.
 * @param {Function} fn - Асинхронная функция, которую нужно выполнить.
 * @param {...*} args - Аргументы, которые будут переданы в функцию `fn`.
 * @returns {Promise<*>} - Результат выполнения функции `fn`.
 * @throws {Error} - Если функция `fn` выбрасывает ошибку, она будет обработана и выброшена снова.
 */
const safeDbCall = async (fn, ...args) => {
   try {
      return await fn(...args)
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = safeDbCall