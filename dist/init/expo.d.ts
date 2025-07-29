import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_expo: () => Effect.Effect<void, string | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Config | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
