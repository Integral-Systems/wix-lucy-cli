import { items, collections } from '@wix/data';
import { sites } from "@wix/sites";
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { Effect } from 'effect/index';
import { Config } from '../config.js';
import { AppError } from '../error.js';
export const createSDKClient = Effect.gen(function* (_) {
    const config = yield* Config;
    const wixSDKSettings = config.config.wixSDKSettings;
    if (wixSDKSettings) {
        return createClient({
            modules: { items, collections, sites },
            auth: ApiKeyStrategy(wixSDKSettings),
        });
    }
    return yield* Effect.fail(new AppError({ message: "No API key provided", cause: new Error("No API key provided") }));
});
//# sourceMappingURL=client.js.map