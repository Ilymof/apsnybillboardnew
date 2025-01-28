'use strict'
/**
 * pipe - Композиция функций слева направо.
 * @param  {...Function} fns - функции для последовательного применения
 * @returns {Function} - новая функция, которая принимает начальное значение
 */
const pipe = (...fns) => {
  return async (initialValue) => {
    let acc = initialValue;
    for (const fn of fns) {
      acc = await fn(acc);
    }
    return acc;
  };
};

module.exports = pipe 