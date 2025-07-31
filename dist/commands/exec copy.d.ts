import { Effect } from "effect/index";
import { Config } from "../config.js";
export declare const execCommand: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | import("@effect/platform/CommandExecutor").CommandExecutor>;
