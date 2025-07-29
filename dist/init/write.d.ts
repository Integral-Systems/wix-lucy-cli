import { Effect } from "effect/index";
import { FileSystem, Path } from "@effect/platform";
import { Config } from "../config.js";
export declare const writeLucySettings: Effect.Effect<void, import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Path.Path | Config>;
export declare const writePackageJson: Effect.Effect<void, import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Path.Path | Config>;
