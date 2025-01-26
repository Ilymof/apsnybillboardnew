'use strict'
const Left = (value) => ({
	value,
	map: () => Left(value),
	chain: () => Left(value),
	fold: (f, g) => f(value),
	toString: () => `Left(${value})`,
	isLeft: () => true,
	isRight: () => false
});

const Right = (value) => ({
	value,
	map: (fn) => Right(fn(value)),
	chain: (fn) => fn(value),
	fold: (f, g) => g(value),
	toString: () => `Right(${value})`,
	isLeft: () => false,
	isRight: () => true
});

const either = {
	Left,
	Right,
};

module.exports = { either };
