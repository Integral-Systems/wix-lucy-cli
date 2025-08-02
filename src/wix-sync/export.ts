import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { logger } from "../utils/logger.js";
import veloAPI from 'velo-sync/dist/velo/velo-api.js';

export const exportData = Effect.gen(function* (_) {
    const config = yield* Config;
    const veloSyncSettings = config.config.veloSyncSettings;
    if (!veloSyncSettings) return yield* Effect.fail(new AppError({ message: 'Velo-sync settings not found', cause: new Error('Velo-sync settings not found') }));

    logger.action(`Exporting data for site ${veloSyncSettings.siteUrl}...`);

    logger.warning('Not implemented yet, please use the Velo Sync CLI for now.');

    // logger.success(`Data for site ${veloSyncSettings.siteUrl} exported successfully!`);
    return
})