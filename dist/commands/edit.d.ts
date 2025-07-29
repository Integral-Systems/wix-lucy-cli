import { Effect } from "effect/index";
import { Config } from "../config.js";
export declare const editJson: (json: any, keys: string[], values: string[] | Object[]) => Effect.Effect<void, never, Config>;
export declare const mergeLucySettings2PackageJson: Effect.Effect<void, never, Config>;
export declare const setModule: Effect.Effect<void, never, Config>;
export declare const mergeAdditions: Effect.Effect<void, never, Config>;
