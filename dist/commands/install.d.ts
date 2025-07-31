import { Effect } from "effect/index";
import { Config } from "../config.js";
import { CommandExecutor } from "@effect/platform/CommandExecutor";
import { PlatformError } from "@effect/platform/Error";
export declare const installPackages: Effect.Effect<void, PlatformError, Config | CommandExecutor>;
export declare const runYarn: Effect.Effect<void, PlatformError, CommandExecutor>;
export declare const yarnSetVersion: Effect.Effect<void, PlatformError, CommandExecutor>;
export declare const installVeloPackages: Effect.Effect<void, PlatformError, Config | CommandExecutor>;
