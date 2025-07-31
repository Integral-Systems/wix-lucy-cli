import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const cleanup: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
