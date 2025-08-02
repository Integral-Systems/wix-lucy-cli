import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const is_alive: Effect.Effect<undefined, AppError, Config>;
