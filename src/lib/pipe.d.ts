// src/lib/pipe.d.ts
declare function pipe<T, R>(...fns: Array<(input: T) => R>): (input: T) => R;

export = pipe; 
