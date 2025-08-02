import { Effect, Schema } from "effect/index";
import { Config, lucyJsonPath } from "../config.js";
import { FileSystem, Path } from "@effect/platform"
import { logger } from "../utils/logger.js";
import { JsonSchema } from "../schemas/index.js";
import { LucySettings } from "../schemas/lucy.js";

export const editJson = (json: any, keys: string[], values: string[] | Object[]) => {
    return Effect.gen(function*() {
        const config = yield* Config;

        for (const key of keys){
			const index = keys.indexOf(key);
			const value = values[index];
			json[key] = value;
		}
    })
}

export const mergeLucySettings2PackageJson = Effect.gen(function*() {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;

    if (Object.keys(lucySettings.scripts).length > 0) {
        yield* editJson(packageJson, ['scripts'], [{...packageJson.scripts, ...lucySettings.scripts}]);
    }
})

export const setModule = Effect.gen(function*() {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;

	yield* editJson(packageJson, ['type'], ['module']);
})

export const mergeAdditions = Effect.gen(function*() {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;

	config.config.packageJson = {
        ...packageJson,
        ...lucySettings.additionalPkgProps,
    }
})

export const setProjectName = Effect.gen(function*() {
    const config = yield* Config;
    const packageJson = config.config.packageJson;

	yield * editJson(packageJson, ["name"], [config.config.projectName]);
})

export const setInitialized = Effect.gen(function*() {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const lucyRaw = yield* fs.readFileString(lucyJsonPath);
    const lucyJSON = (yield* Schema.decodeUnknown(JsonSchema)(lucyRaw)) as any;
    lucyJSON.initialized = true;

    yield* fs.writeFileString(lucyJsonPath, JSON.stringify(lucyJSON, null, 2));
})

export const stringReplace = (filePath: string, keys: string[], values: string[]) => {
    return Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem;
        let modifiedContent: string = '';

        logger.action(`Replacing ${keys} with ${values} in ${filePath}`);
        const data = yield* fs.readFileString(filePath, 'utf8');
        for (const key of keys){
			const index = keys.indexOf(key);
			const value = values[index];
			const regex = new RegExp(`${key}`, 'g');
			modifiedContent = data.replace(regex, `${value}`);
		}
        yield* fs.writeFileString(filePath, modifiedContent);
        logger.info(`Updated file ${filePath}`);
    })
}