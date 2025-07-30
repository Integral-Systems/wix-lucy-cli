import { Effect } from "effect/index";
import { Config } from "../config.js";
export const editJson = (json, keys, values) => {
    return Effect.gen(function* () {
        const config = yield* Config;
        for (const key of keys) {
            const index = keys.indexOf(key);
            const value = values[index];
            json[key] = value;
        }
    });
};
export const mergeLucySettings2PackageJson = Effect.gen(function* () {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;
    yield* editJson(packageJson, ['scripts'], [{ ...packageJson.scripts, ...lucySettings.scripts }]);
});
export const setModule = Effect.gen(function* () {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;
    yield* editJson(packageJson, ['type'], ['module']);
});
export const mergeAdditions = Effect.gen(function* () {
    const config = yield* Config;
    const lucySettings = config.config.lucySettings;
    const packageJson = config.config.packageJson;
    config.config.packageJson = {
        ...packageJson,
        ...lucySettings.additionalPkgProps,
    };
});
//# sourceMappingURL=edit.js.map