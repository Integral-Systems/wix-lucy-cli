import { Effect } from "effect/index";
import { Config } from "./config.js";
import { Terminal, FileSystem, Path } from "@effect/platform";
export declare const init: () => Effect.Effect<void, string | import("@effect/platform/Error").PlatformError, Config | Terminal.Terminal | FileSystem.FileSystem | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
