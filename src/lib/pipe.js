'use strict'
/**
 * pipe - Композиция функций слева направо.
 * @param  {...Function} fns - функции для последовательного применения
 * @returns {Function} - новая функция, которая принимает начальное значение
 */
const pipe = (...fns) => {
  return (initialValue) => {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
};

module.exports = pipe 