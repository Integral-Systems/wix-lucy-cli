import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const importData: Effect.Effect<undefined, AppError, Config>;
