import { Effect } from "effect/index";
import { Path } from "@effect/platform";
import { FileSystem } from "@effect/platform";
import { Config } from "../config.js";
export declare const copyTemplateFiles: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
export declare const copySyncFiles: Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
