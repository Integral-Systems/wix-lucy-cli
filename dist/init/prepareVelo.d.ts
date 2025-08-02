import { Effect } from 'effect/index';
export declare const prepareVelo: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | import("../error.js").AppError, import("../config.js").Config | import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
