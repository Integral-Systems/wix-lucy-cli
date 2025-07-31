import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_monorepo: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError | import("effect/ParseResult").ParseError | import("../error.js").AppError, Config | import("@effect/platform/CommandExecutor").CommandExecutor | FileSystem.FileSystem | Path.Path>;
