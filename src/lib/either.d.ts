declare function Left<T>(value: T): {
	value: T;
	map: () => Left<T>;
	chain: () => Left<T>;
	fold: (f: (value: T) => any, g: (value: never) => any) => any;
	toString: () => string;
	isLeft: () => boolean;
	isRight: () => boolean;
};

declare function Right<T>(value: T): {
	value: T;
	map: (fn: (value: T) => any) => Right<any>;
	chain: (fn: (value: T) => any | Promise<any>) => any | Promise<any>;
	fold: (f: (value: never) => any, g: (value: T) => any) => any;
	toString: () => string;
	isLeft: () => boolean;
	isRight: () => boolean;
};

declare const either: {
	Left: typeof Left;
	Right: typeof Right;
};

export = either; // Используйте export = для совместимости с CommonJS
