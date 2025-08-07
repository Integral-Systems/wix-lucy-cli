import { Effect, Schema } from "effect/index";
import { FileSystem, Path } from "@effect/platform"
import { Config, lucyJsonName, packageJsonPath, veloSyncJsonPath } from "../config.js";
import { JsonSchema, veloSyncSettings } from "../schemas/index.js";
import { lucySettings } from "../schemas/lucy.js";
import { logger } from "../utils/logger.js";

export const readPackageJson = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const packageJsonRaw = yield* fs.readFile(packageJsonPath)
    config.config.packageJson = yield* Schema.decodeUnknown(JsonSchema)(packageJsonRaw.toString());
})

export const readLucyJsonFromTemplate = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    
    const lucyRaw = yield* fs.readFileString(path.join(config.config.templateDir, lucyJsonName));   
    const lucySettingsJSON = yield* Schema.decodeUnknown(JsonSchema)(lucyRaw); 
    const lucySetting = yield* Schema.decodeUnknown(lucySettings)(lucySettingsJSON)

    if(config.config.lucySettings.initialized) {
        if(config.config.force) {
            logger.warning(`${lucyJsonName} already exists in the target directory, but 'force' is set. Overwriting...`);
            config.config.lucySettings = lucySetting;
            return;
        }
        logger.warning(`${lucyJsonName} already exists in the target directory. Skipping reading ${lucyJsonName} from template.`);
        return;
    }
    config.config.lucySettings = lucySetting;
})

export const readVeloSyncSettings = Effect.gen(function* ()   {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    if (yield* fs.exists(veloSyncJsonPath)) {
        const snyConfigRaw = yield* fs.readFileString(veloSyncJsonPath)
        config.config.veloSyncSettings = yield* Schema.decodeUnknown(veloSyncSettings)(snyConfigRaw);
    }
});