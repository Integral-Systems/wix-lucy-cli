import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import { createSDKClient } from "./client.js";

export const wix_sdk_check = Effect.gen(function* (_) {
    const config = yield* Config;
    const wixSDKSettings = config.config.wixSDKSettings;
    if (!wixSDKSettings) return yield* Effect.fail(new AppError({ message: 'Wix SDK settings not found', cause: new Error('Wix SDK settings not found') }));
    const client = yield* createSDKClient;

    logger.action(`Checking if the SDK is working`);

    const res = yield* Effect.tryPromise({
        try: () => client.sites.countSites(),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error checking if the SDK is working' });
        }
    })
    if(res.count) {
        return logger.success(`SDK for site ${wixSDKSettings.siteId} is alive and working!`);
    }
})
