import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
import { AppError } from "../error.js";
export declare const init_expo: () => Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | AppError, Config | FileSystem.FileSystem | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
