import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import { migrateFileCacheTask } from "./client.js";
export const migrate = Effect.gen(function* (_) {
    const config = yield* Config;
    const veloSyncSettings = config.config.veloSyncSettings;
    if (!veloSyncSettings)
        return yield* Effect.fail(new AppError({ message: 'Velo-sync settings not found', cause: new Error('Velo-sync settings not found') }));
    logger.action(`Migrating file cache for site ${veloSyncSettings.siteUrl}...`);
    const res = yield* Effect.tryPromise({
        try: () => migrateFileCacheTask(),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error migrating file cache' });
        }
    });
    logger.success(`File cache for site ${veloSyncSettings.siteUrl} migrated successfully!`);
    return;
});
//# sourceMappingURL=migrate.js.map