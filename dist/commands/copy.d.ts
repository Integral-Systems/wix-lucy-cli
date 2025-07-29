import { Effect } from "effect/index";
import { Path } from "@effect/platform";
import { FileSystem } from "@effect/platform";
import { Config } from "../config.js";
export declare const copyFileSync: Effect.Effect<void, import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Config | Path.Path>;
