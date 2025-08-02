import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { wix_sdk_init } from "./init.js";
export const wix_sdk = Effect.gen(function* (_) {
    const config = yield* Config;
    if (config.config.action.wixSDKAction === undefined) {
        return yield* Effect.fail(new AppError({ message: "No wix-sdk action provided", cause: new Error("No wix-sdk action provided") }));
    }
    if (config.config.action.wixSDKAction === 'init') {
        return yield* wix_sdk_init;
    }
    yield* Effect.fail(new AppError({ message: `Unsupported wix-sdk action type: ${config.config.action.syncAction}`, cause: new Error(`Unsupported wix-sdk action type: ${config.config.action.syncAction}`) }));
});
//# sourceMappingURL=index.js.map