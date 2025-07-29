import { Effect } from "effect/index";
import { FileSystem } from "@effect/platform";
import { Config } from "../config.js";
export declare const isDirectoryClean: (excludes?: string[]) => Effect.Effect<boolean, import("@effect/platform/Error").PlatformError, FileSystem.FileSystem | Config>;
