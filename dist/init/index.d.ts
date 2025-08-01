import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const init: () => Effect.Effect<void, AppError | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, import("@effect/platform/FileSystem").FileSystem | Config | import("@effect/platform/Path").Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
