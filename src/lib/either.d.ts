declare function Left<T>(error: T): {
	map: <U>(fn: (value: never) => U) => ReturnType<typeof Left>;
	chain: <U>(fn: (value: never) => U) => ReturnType<typeof Left>;
	fold: <U, V>(leftFn: (error: T) => U, rightFn: (value: never) => V) => U;
	isLeft: true;
	isRight: false;
};

declare function Right<T>(value: T): {
	map: <U>(fn: (value: T) => U) => ReturnType<typeof Right>;
	chain: <U>(fn: (value: T) => U) => U;
	fold: <U, V>(leftFn: (error: never) => U, rightFn: (value: T) => V) => V;
	isLeft: false;
	isRight: true;
};

declare const Either: {
	of: <T>(value: T) => ReturnType<typeof Right>;
	fromNullable: <T>(value: T | null | undefined) => ReturnType<typeof Right> | ReturnType<typeof Left>;
	map: <T, U>(fn: (value: T) => U) => (either: ReturnType<typeof Right<T>> | ReturnType<typeof Left<any>>) => ReturnType<typeof Right<U>> | ReturnType<typeof Left<any>>;
	chain: <T, U>(fn: (value: T) => U | ReturnType<typeof Right<U>> | ReturnType<typeof Left<any>>) => (either: ReturnType<typeof Right<T>> | ReturnType<typeof Left<any>>) => U | ReturnType<typeof Left<any>>;
	fold: <T, U, V>(
		leftFn: (error: T) => U,
		rightFn: (value: V) => V
	) => (either: ReturnType<typeof Right<V>> | ReturnType<typeof Left<T>>) => U | V;
	Left: typeof Left;
	Right: typeof Right;
};

export = Either;
