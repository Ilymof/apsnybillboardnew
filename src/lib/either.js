// either.js
const Right = (value) => ({
	map: (fn) => Right(fn(value)),
	chain: (fn) => fn(value),
	fold: (_, rightFn) => rightFn(value),
	isRight: true,
	isLeft: false,
});

const Left = (error) => ({
	map: (_) => Left(error),
	chain: (_) => Left(error),
	fold: (leftFn, _) => leftFn(error),
	isRight: false,
	isLeft: true,
});

const Either = {
	of: (value) => Right(value),
	fromNullable: (value) => (value != null ? Right(value) : Left("Value is null")),
	map: (fn) => (either) => either.map(fn),
	chain: (fn) => (either) => either.chain(fn),
	fold: (leftFn, rightFn) => (either) => either.fold(leftFn, rightFn),
	Left: (value) => Left(value),
	Right: (value) => Right(value)
};

module.exports = Either;