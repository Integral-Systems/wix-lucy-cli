import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const init: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | AppError, Config | import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path>;
