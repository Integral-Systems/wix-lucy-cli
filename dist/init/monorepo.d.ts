import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_monorepo: () => Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError | import("../error.js").AppError, Config | FileSystem.FileSystem | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
