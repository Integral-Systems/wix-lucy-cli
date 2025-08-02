import { Effect } from "effect/index";
import { Config } from "../config.js";
export declare const task_syncSettings: Effect.Effect<void, import("@effect/platform/Error").PlatformError, import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path | Config>;
