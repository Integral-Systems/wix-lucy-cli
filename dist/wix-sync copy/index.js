import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { wix_sync_init } from "./init.js";
export const wix_sync = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if (config.config.action.syncAction === undefined) {
            return yield* Effect.fail(new AppError({ message: "No sync action provided", cause: new Error("No sync action provided") }));
        }
        if (config.config.action.syncAction === 'init') {
            return yield* wix_sync_init;
        }
        yield* Effect.fail(new AppError({ message: `Unsupported sync action type: ${config.config.action.syncAction}`, cause: new Error(`Unsupported action type: ${config.config.action.syncAction}`) }));
    });
};
//# sourceMappingURL=index.js.map