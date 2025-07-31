import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
export declare const execCommand: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | import("@effect/platform/CommandExecutor").CommandExecutor>;
export declare const open: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | import("@effect/platform/CommandExecutor").CommandExecutor | FileSystem.FileSystem>;
