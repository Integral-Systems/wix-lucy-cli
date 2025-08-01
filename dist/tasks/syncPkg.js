import { Effect } from "effect/index";
import { logger } from "../utils/logger.js";
import { Config } from "../config.js";
export const task_syncPkgs = Effect.gen(function* () {
    const config = yield* Config;
    logger.action("Syncing packages...");
    if (config.config.lucySettings.initialized) {
        console.log(config.config.packageJson);
        console.log(config.config.lucySettings);
    }
    logger.success("GIT initialized successfully!");
});
//# sourceMappingURL=syncPkg.js.map