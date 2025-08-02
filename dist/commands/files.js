import { Effect } from "effect/index";
import { FileSystem, Path } from "@effect/platform";
import { Config, lucyJsonPath, packageJsonPath, veloSyncJsonPath, wixSDKSettingsJsonPath } from "../config.js";
export const writeLucySettings = Effect.gen(function* (_) {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const config = yield* Config;
    yield* fs.writeFileString(lucyJsonPath, JSON.stringify(config.config.lucySettings, null, 2));
});
export const writePackageJson = Effect.gen(function* (_) {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const config = yield* Config;
    yield* fs.writeFileString(packageJsonPath, JSON.stringify(config.config.packageJson, null, 2));
});
export const writeVeloSyncSettings = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    yield* fs.writeFileString(veloSyncJsonPath, JSON.stringify(config.config.veloSyncSettings, null, 2));
});
export const writeWixSDKSettings = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    yield* fs.writeFileString(wixSDKSettingsJsonPath, JSON.stringify(config.config.wixSDKSettings, null, 2));
});
//# sourceMappingURL=files.js.map