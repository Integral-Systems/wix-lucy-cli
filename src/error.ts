import { Data } from "effect";

export class AppError extends Data.TaggedError('AppError')<{cause: unknown, message: string}> {}
