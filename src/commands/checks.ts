import { Effect, Schema } from "effect/index";
import { Command, FileSystem, Path } from "@effect/platform"
import { Config } from "../config.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../error.js";
import { JsonSchema } from "../schemas/index.js";

export const isDirectoryClean =(excludes: string[] = []) => {
    return Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem;
        const config = yield* Config;

        const files = yield* fs.readDirectory(config.config.cwd);
        const allExcludes = [...excludes, '.git', 'lucy.json'];
        const filteredFiles = files.filter(file => !allExcludes.includes(file));

        return filteredFiles.length > 0 ? false : true;
    });
}

export const checkForDirty = (excludes: string[] = []) => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const clean = yield* isDirectoryClean(excludes);
        if(!clean && !config.config.force) {
            logger.alert("The current directory is not empty. Please run this command in an empty directory.")
            yield* Effect.fail(new AppError({ message: "Directory is not clean", cause: new Error("Directory is not clean") }));
            return;
        }
        if(config.config.lucySettings.initialized && !config.config.force) {
            logger.alert("Lucy is already initialized in this directory. Use --force to reinitialize.")
            yield* Effect.fail(new AppError({ message: "Lucy is already initialized in this directory", cause: new Error("Lucy is already initialized in this directory") }));
            return;
        }

        if ((!clean && config.config.force) || (config.config.lucySettings.initialized && config.config.force)) logger.alert("Forced initialization!")
    });
}
export const checkForVelo = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;

        const wixConfigPath = path.join(config.config.cwd, 'wix.config.json'); 
        const wixConfigRaw = yield* fs.readFileString(wixConfigPath);
        const wixConfigJSON =( yield* Schema.decodeUnknown(JsonSchema)(wixConfigRaw)) as any;

        if(!(wixConfigJSON.siteId)) return yield* Effect.fail(new AppError({ message: "This directory is not a Velo project. Please run this command in a Velo project directory.", cause: new Error("Not a Velo project") }));
    });
}