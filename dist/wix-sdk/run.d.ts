import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const wix_sdk_run: (program: Effect.Effect<never, AppError, never>) => Effect.Effect<void, import("@effect/platform/Error").PlatformError | AppError | import("effect/ParseResult").ParseError, import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path | Config>;
