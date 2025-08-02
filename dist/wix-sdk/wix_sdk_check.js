import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import { createSDKClient } from "./client.js";
export const wix_sdk_check = Effect.gen(function* (_) {
    const config = yield* Config;
    const wixSDKSettings = config.config.wixSDKSettings;
    if (!wixSDKSettings)
        return yield* Effect.fail(new AppError({ message: 'Wix SDK settings not found', cause: new Error('Wix SDK settings not found') }));
    const client = yield* createSDKClient;
    logger.action(`Checking if the SDK is working`);
    const res = yield* Effect.tryPromise({
        try: () => client.collections.listDataCollections(),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error checking if the SDK is working' });
        }
    });
    if (res.collections) {
        return logger.success(`SDK is working!`);
    }
    return logger.success(`SDK is not working!`);
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
//# sourceMappingURL=wix_sdk_check.js.map