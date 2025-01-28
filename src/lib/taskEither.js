// taskEither.js
const E = require('./either'); // Ваш модуль с Either

// Определяем Task
const Task = (fn) => ({
  run: () => new Promise((resolve) => resolve(fn())),
});

// Создаем TaskEither
const TaskEither = (fn) => ({
  run: () => Task(fn).run(),

  map: (f) => TaskEither(async () => {
    const result = await fn();
    return result.isRight ? E.Right(f(result.value)) : result;
  }),

  chain: (f) => TaskEither(async () => {
    const result = await fn();
    return result.isRight ? await f(result.value).run() : result;
  }),

  fold: (onLeft, onRight) => TaskEither(async () => {
    const result = await fn();
    return result.isRight ? onRight(result.value) : onLeft(result.value);
  }),

  of: (value) => TaskEither(async () => E.Right(value)),
  fromNullable: (value) =>
    TaskEither(async () =>
      value != null ? E.Right(value) : E.Left("Value is null")
    ),
});

module.exports = TaskEither;
