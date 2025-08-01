import { Effect } from "effect/index";
import { logger } from "../utils/logger.js";
import { Config } from "../config.js";
import { writeLucySettings } from "../commands/write.js";
export const task_syncSettings = Effect.gen(function* () {
    const config = yield* Config;
    logger.action("Syncing settings...");
    if (config.config.lucySettings.initialized) {
        config.config.lucySettings.dependencies = config.config.packageJson.dependencies;
        config.config.lucySettings.devDependencies = config.config.packageJson.devDependencies;
        config.config.lucySettings.scripts = config.config.packageJson.scripts;
        yield* writeLucySettings;
        logger.success("Settings synced successfully.");
        return;
    }
    logger.error("Lucy settings are not initialized. Please run 'lucy init' first.");
});
//# sourceMappingURL=syncSettings.js.map