import { Effect } from "effect/index";
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import veloAPI from 'velo-sync/dist/velo/velo-api.js';
export const wix_sync_alive = Effect.gen(function* (_) {
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
//     if(moduleSettings.args.includes('is-alive')) {
//         try {
//             let config = await readConfig(moduleSettings.veloConfigName);
//             console.log("🐕" + green(` => checking if the API for site ${chalk.greenBright(config.siteUrl)} is alive...`));
//             await veloAPI.isAlive(config);
//             return console.log(chalk.green("🐕" + ` => API of site ${chalk.greenBright(config.siteUrl)} is working and alive!!!`));
//         }
//         catch (e) {
//             if(e instanceof Error)  {
//                 return console.log((`💩 ${red.underline.bold("=> Failed to check endpoint")} ${orange(e.message)}`));
//             }
//         }
//     }
//# sourceMappingURL=is-allive.js.map