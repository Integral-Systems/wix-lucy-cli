import { Effect } from "effect/index";
import { Config } from "../config.js";
export declare function sync(): Promise<void | Effect.Effect<void, never, Config>>;
