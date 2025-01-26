'use strict'
const isPromise = value =>
  value !== null && typeof value === 'object' && typeof value.then === 'function';

const pipe = (...fns) => input => {
  return fns.reduce((result, fn) => {
    if (typeof fn !== 'function') throw new TypeError('All arguments to pipe must be functions');
    if (isPromise(result)) return result.then(fn);
    return fn(result);
  }, input);
};

module.exports = pipe