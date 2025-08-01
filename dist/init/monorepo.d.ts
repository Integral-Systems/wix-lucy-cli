import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_monorepo: () => Effect.Effect<void, import("../error.js").AppError | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Config | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
