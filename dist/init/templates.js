import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import { orange, red, green, logger } from "../utils/logger.js";
import { FileSystem } from "@effect/platform";
import { join } from 'path';
import fsp from 'fs/promises';
import Enquirer from 'enquirer';
import { AppError } from "../error.js";
import { lucySettings } from "../schemas/lucy.js";
import { JsonSchema } from "../schemas/index.js";
export const selectTemplate = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const templatesPath = join(config.config.lucyHome, 'templates');
        const files = yield* Effect.tryPromise({
            try: () => fsp.readdir(templatesPath, { withFileTypes: true }),
            catch: (e) => {
                console.log((`💩 ${red.underline.bold("=> Templates folder not found at =>")} ${orange(templatesPath)}`));
                return new AppError({ cause: e, message: 'Templates folder not found' });
            }
        });
        const templateChoices = [];
        for (const dirent of files) {
            if (dirent.isDirectory()) {
                const lucyJsonPath = join(templatesPath, dirent.name, 'lucy.json');
                const lucyRaw = yield* fs.readFileString(lucyJsonPath, 'utf-8');
                const lucySettingsJSON = yield* Schema.decodeUnknown(JsonSchema)(lucyRaw);
                const lucySetting = yield* Schema.decodeUnknown(lucySettings)(lucySettingsJSON);
                if (lucySetting.type === config.config.action.type) {
                    templateChoices.push(dirent.name);
                }
            }
        }
        if (templateChoices.length === 0) {
            console.log((`💩 ${red.underline.bold("=> No templates found in =>")} ${orange(templatesPath)}`));
            return;
        }
        const templateQuestion = new Enquirer();
        const choice = yield* Effect.tryPromise({
            try: () => templateQuestion.prompt({
                type: 'select',
                name: 'template',
                message: 'Select a project template',
                choices: templateChoices
            }),
            catch: (e) => {
                return new AppError({ cause: e, message: 'Error selecting template' });
            }
        });
        const selectedTemplate = yield* Schema.decodeUnknown(Schema.Struct({ template: Schema.String }))(choice);
        const templateDir = join(templatesPath, selectedTemplate.template);
        const templateFilesDir = join(templateDir, 'files');
        config.config.templateDir = templateDir;
        config.config.templateFiles = templateFilesDir;
        const templateSettingsPath = join(templateDir, 'lucy.json');
        if (!(yield* fs.exists(templateSettingsPath))) {
            logger.warning((`💩 ${red.underline.bold("=> Template is missing lucy.json at =>")} ${orange(templateSettingsPath)}`));
            yield* Effect.fail(new AppError({ message: 'Template is missing lucy.json', cause: templateSettingsPath }));
        }
        const lucySettingsRaw = yield* fs.readFileString(templateSettingsPath, 'utf-8');
        const newLucySettings = yield* Schema.decodeUnknown(lucySettings)(JSON.parse(lucySettingsRaw));
        if (newLucySettings.type !== config.config.action.type)
            return yield* Effect.fail(new AppError({
                message: `Template type ${newLucySettings.type} does not match action type ${config.config.action.type}`,
                cause: newLucySettings.type
            }));
        if (config.config.lucySettings.initialized) {
            const overwriteQuestion = new Enquirer();
            const overwrite = yield* Effect.tryPromise({
                try: () => overwriteQuestion.prompt({
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Overwrite existing lucy.json settings?',
                }),
                catch: (e) => {
                    return new AppError({
                        cause: e,
                        message: "Error overwriting settings",
                    });
                }
            });
            const choice = yield* Schema.decodeUnknown(Schema.Struct({ overwrite: Schema.Boolean }))(overwrite);
            if (choice.overwrite) {
                config.config.lucySettings = newLucySettings;
            }
            else {
                logger.info(`Existing lucy.json settings will be used.`);
            }
        }
        logger.success(`Selected template: ${green(selectedTemplate.template)}`);
    });
};
//# sourceMappingURL=templates.js.map