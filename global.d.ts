import * as Pipe from './src/lib/pipe.d.ts'
import * as Either from './src/lib/either.d.ts'
import * as TaskEither from './src/lib/taskEither.d.ts'
declare global {
  namespace api { }
  const pipe: typeof Pipe
  const either: typeof Either
  const taskEither: typeof TaskEither
}