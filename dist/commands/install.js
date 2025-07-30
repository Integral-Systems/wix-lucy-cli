import { Command } from "@effect/platform/index";
import { Effect } from "effect/index";
import { Config } from "../config.js";
import { logger } from "../utils/logger.js";
export const installPackages = Effect.gen(function* () {
    const config = yield* Config;
    const pkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            pkgs.push(`${key}@${value}`);
            continue;
        }
        pkgs.push(key);
    }
    const devPkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.devDependencies)) {
        if (value.length > 0) {
            devPkgs.push(`${key}@${value}`);
            continue;
        }
        devPkgs.push(key);
    }
    logger.info("Installing dependencies");
    const yarn = Command.make("yarn", "add", ...pkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    logger.info("Installing dev dependencies");
    const yarnDev = Command.make("yarn", "add", "-D", ...devPkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    if ((yield* yarn) !== 0) {
        return logger.error("Failed to install dependencies. Please check the error message above.");
    }
    if ((yield* yarnDev) !== 0) {
        return logger.error("Failed to install dev dependencies. Please check the error message above.");
    }
});
//# sourceMappingURL=install.js.map