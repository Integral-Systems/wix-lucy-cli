import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
import { AppError } from "../error.js";
export declare const selectTemplate: () => Effect.Effect<undefined, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | AppError, Config | FileSystem.FileSystem>;
