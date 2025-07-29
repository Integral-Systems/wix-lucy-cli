import { Effect, Schema } from "effect/index";
import { FileSystem, Path } from "@effect/platform"
import { Config } from "../config.js";
import { JsonSchema } from "../schemas/index.js";
import { lucySettings } from "../schemas/lucy.js";
import { logger } from "../utils/logger.js";

export const readPackageJson = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const packageJsonPath = path.join(config.config.cwd, "package.json")
    const packageJsonRaw = yield* fs.readFile(packageJsonPath)
    config.config.packageJson = yield* Schema.decodeUnknown(JsonSchema)(packageJsonRaw.toString());
})

export const readLucyJsonFromTemplate = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const lucyJsonPath = path.join(config.config.templateDir, "lucy.json")
    const lucyJsonRaw = yield* fs.readFile(lucyJsonPath)
    if(config.config.lucySettings.initialized) {
        if(config.config.force) {
            logger.warning(`lucy.json already exists in the template directory, but 'force' is set. Overwriting...`);
            config.config.lucySettings = yield* Schema.decodeUnknown(lucySettings)(lucyJsonRaw.toString());
            return;
        }
        logger.warning(`lucy.json already exists in the template directory. Skipping reading lucy.json from template.`);
        return;
    }
    config.config.lucySettings = yield* Schema.decodeUnknown(lucySettings)(lucyJsonRaw.toString());
})