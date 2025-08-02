import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import { runSyncTask } from "./client.js";
export const importData = Effect.gen(function* (_) {
    const config = yield* Config;
    const veloSyncSettings = config.config.veloSyncSettings;
    if (!veloSyncSettings)
        return yield* Effect.fail(new AppError({ message: 'Velo-sync settings not found', cause: new Error('Velo-sync settings not found') }));
    logger.action(`Importing data for site ${veloSyncSettings.siteUrl}...`);
    let filename = config.config.veloSyncArguments?.data || '';
    let collection = config.config.veloSyncArguments?.collection || '';
    let schema = config.config.veloSyncArguments?.schema || '';
    let dryrun = config.config.veloSyncArguments?.dry || false;
    let importOnly = true;
    const res = yield* Effect.tryPromise({
        try: () => runSyncTask(filename, collection, schema, importOnly, dryrun),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error syncing data' });
        }
    });
    logger.success(`Data for site ${veloSyncSettings.siteUrl} imported successfully!`);
    return;
});
//# sourceMappingURL=import.js.map