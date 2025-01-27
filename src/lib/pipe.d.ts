// src/lib/pipe.d.ts
declare function pipe<T, R>(...fns: Array<(input: T) => R | Promise<R>>): (input: T) => R | Promise<R>;

export = pipe; // Используйте export = для совместимости с CommonJS
