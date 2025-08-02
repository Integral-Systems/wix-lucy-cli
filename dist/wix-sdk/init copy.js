import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { writeWixSDKSettings } from "../commands/write.js";
import { wixSDKSettings } from "../schemas/index.js";
import { logger } from "../utils/logger.js";
import { wix_sdk_check } from "./check.js";
export const wix_sdk_init = Effect.gen(function* (_) {
    const config = yield* Config;
    const prompter = new Enquirer();
    const choice = yield* Effect.tryPromise({
        try: () => prompter.prompt([
            {
                type: 'input',
                name: 'siteId',
                message: 'Enter the Wix SDK site ID',
                initial: config.config.wixSDKSettings?.siteId || 'siteId',
                validate: (value) => value.trim() !== '' ? true : 'Site ID cannot be empty'
            },
            {
                type: 'input',
                name: 'apiKey',
                message: 'Enter the Wix SDK API key',
                initial: config.config.wixSDKSettings?.apiKey || 'apiKey',
                validate: (value) => value.trim() !== '' ? true : 'API key cannot be empty'
            }
        ]),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error initializing wix-sdk settings' });
        }
    });
    config.config.wixSDKSettings = yield* Schema.decodeUnknown(wixSDKSettings)(choice);
    yield* writeWixSDKSettings;
    const question = new Enquirer();
    const verify = yield* Effect.tryPromise({
        try: () => question.prompt({
            type: 'confirm',
            name: 'verify',
            message: 'Do you want to verify the wix-sdk settings?',
        }),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error setting up wix-sdk settings' });
        }
    });
    const verifySDK = yield* Schema.decodeUnknown(Schema.Struct({ verify: Schema.Boolean }))(verify);
    if (verifySDK.verify)
        yield* wix_sdk_check;
    logger.success(`Velo-sync settings initialized successfully!`);
});
//# sourceMappingURL=init%20copy.js.map