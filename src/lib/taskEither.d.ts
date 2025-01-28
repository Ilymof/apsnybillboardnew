declare function TaskEither<E, A>(fn: () => Promise<Either<E, A>>): {
  run: () => Promise<Either<E, A>>;
  map<B>(f: (value: A) => B): TaskEither<E, B>;
  chain<B>(f: (value: A) => TaskEither<E, B>): TaskEither<E, B>;
  fold<B>(onLeft: (error: E) => B, onRight: (value: A) => B): Promise<B>;
  of<B>(value: B): TaskEither<E, B>;
  fromNullable<B>(value: B | null | undefined): TaskEither<E, B>;
};

export = TaskEither;
