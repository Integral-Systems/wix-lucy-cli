import { Effect } from "effect/index";
import { FileSystem, Path } from "@effect/platform";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const isDirectoryClean: (excludes?: string[]) => Effect.Effect<boolean, import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Config>;
export declare const checkForDirty: (excludes?: string[]) => Effect.Effect<void, import("@effect/platform/Error").PlatformError | AppError, FileSystem.FileSystem | Config>;
export declare const checkForVelo: () => Effect.Effect<undefined, import("@effect/platform/Error").PlatformError | AppError | import("effect/ParseResult").ParseError, FileSystem.FileSystem | Config | Path.Path>;
