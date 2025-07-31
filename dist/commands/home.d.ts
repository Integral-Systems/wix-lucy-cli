import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
export declare const createLucyHome: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem>;
