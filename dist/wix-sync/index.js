import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { wix_sync_init } from "./init.js";
import { sync } from "./sync2.js";
export const wix_sync = Effect.gen(function* (_) {
    const config = yield* Config;
    if (config.config.action.syncAction === undefined) {
        return yield* Effect.fail(new AppError({ message: "No sync action provided", cause: new Error("No sync action provided") }));
    }
    if (config.config.action.syncAction === 'init') {
        return yield* wix_sync_init;
    }
    if (config.config.action.syncAction === 'sync') {
        return yield* sync;
    }
    yield* Effect.fail(new AppError({ message: `Unsupported sync action type: ${config.config.action.syncAction}`, cause: new Error(`Unsupported sync action type: ${config.config.action.syncAction}`) }));
});
//# sourceMappingURL=index.js.map