import { Effect } from "effect/index";
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import veloAPI from 'velo-sync/dist/velo/velo-api.js';
export const is_alive = Effect.gen(function* (_) {
    const config = yield* Config;
    const prompter = new Enquirer();
    const veloSyncSettings = config.config.veloSyncSettings;
    if (!veloSyncSettings)
        return yield* Effect.fail(new AppError({ message: 'Velo-sync settings not found', cause: new Error('Velo-sync settings not found') }));
    logger.action(`Checking if the API for site ${veloSyncSettings.siteUrl} is alive...`);
    const res = yield* Effect.tryPromise({
        try: () => veloAPI.isAlive(veloSyncSettings),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error checking if the API is alive' });
        }
    });
    logger.success(`API for site ${veloSyncSettings.siteUrl} is alive and working!`);
    return;
});
//# sourceMappingURL=is-alive.js.map