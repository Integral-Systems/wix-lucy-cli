import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const init: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError | import("effect/ParseResult").ParseError | AppError, Config | import("@effect/platform/CommandExecutor").CommandExecutor | import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path>;
