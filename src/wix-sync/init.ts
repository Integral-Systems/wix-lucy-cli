import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { writeVeloSyncSettings } from "../commands/write.js";
import { veloSyncSettings } from "../schemas/index.js";
import { logger } from "../utils/logger.js";
import { is_alive } from "./is-alive.js";
import { copySyncFiles } from "../commands/copy.js";

export const init = Effect.gen(function* (_) {
    const config = yield* Config;
    const prompter = new Enquirer();

    const choice = yield* Effect.tryPromise({
        try: () => prompter.prompt([
            {
                type: 'input',
                name: 'siteUrl',
                message: 'Enter a project URL',
                initial: config.config.veloSyncSettings?.siteUrl || 'https://example.com',
                validate: (value: string) => {
                    const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!value.trim()) return 'Project URL cannot be empty';
                    if (!urlPattern.test(value.trim())) return 'URL must be in the format https://domain.com';
                    return true;
                }
            },
            {
                type: 'input',
                name: 'secret',
                message: 'Enter the velo-sync secret',
                initial: config.config.veloSyncSettings?.secret || 'secret',
                validate: (value: string) => value.trim() !== '' ? true : 'Secret cannot be empty'
            }
        ]),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error initializing velo-sync settings' });
        }
    });

    config.config.veloSyncSettings = yield* Schema.decodeUnknown(veloSyncSettings)(choice)
    yield* writeVeloSyncSettings

    const copyFilesQuestion = new Enquirer();
    const copyFiles = yield* Effect.tryPromise({
        try: () => copyFilesQuestion.prompt({
            type: 'confirm',
            name: 'copyFiles',
            message: 'Do you want to copy the velo-sync files to your project?',
        }),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error copying velo-sync files' });
        }
    })
        const copy = yield* Schema.decodeUnknown(Schema.Struct({ copyFiles: Schema.Boolean }))(copyFiles)
        if (copy.copyFiles) {
            yield* copySyncFiles
        }


    const question = new Enquirer();
    const verify = yield* Effect.tryPromise({
        try: () => question.prompt({
            type: 'confirm',
            name: 'verify',
            message: 'Do you want to verify the velo-sync settings?',
        }),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error setting up velo-sync settings' });
        }
    })
    const verifySync = yield* Schema.decodeUnknown(Schema.Struct({ verify: Schema.Boolean }))(verify)
    if (verifySync.verify) yield* is_alive

    logger.success(`Velo-sync settings initialized successfully!`);
})