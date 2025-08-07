import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
import { AppError } from "../error.js";
export declare const execCommand: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | import("@effect/platform/CommandExecutor").CommandExecutor>;
export declare const open: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | import("@effect/platform/CommandExecutor").CommandExecutor>;
export declare const openVSCode: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | AppError, Config | import("@effect/platform/CommandExecutor").CommandExecutor>;
