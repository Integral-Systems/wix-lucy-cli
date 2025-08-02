import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { init } from "./init.js";
import { sync } from "./sync.js";
import { migrate } from "./migrate.js";
import { importData } from "./import.js";
import { exportData } from "./export.js";
import { is_alive } from "./is-alive.js";


export const wix_sync = Effect.gen(function* (_) {
    const config = yield* Config;
    if(config.config.action.syncAction === undefined) {
        return yield* Effect.fail(new AppError({ message: "No sync action provided", cause: new Error("No sync action provided") }));
    }
    if(config.config.action.syncAction === 'init') {
        return yield* init;
    }
    if(config.config.action.syncAction === 'sync') {
        return yield* sync;
    }
    if(config.config.action.syncAction === 'migrate') {
        return yield* migrate;
    }
    if(config.config.action.syncAction === 'import') {
        return yield* importData;
    }
    if(config.config.action.syncAction === 'export') {
        return yield* exportData;
    }
    if(config.config.action.syncAction === 'is-alive') {
        return yield* is_alive;
    }
    yield* Effect.fail(new AppError({ message: `Unsupported sync action type: ${config.config.action.syncAction}`, cause: new Error(`Unsupported sync action type: ${config.config.action.syncAction}`) }));
})